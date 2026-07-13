import { createContext, useCallback, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);
const ADMIN_ROLES = ["admin", "super_admin"];

const normalizeUser = (user) => {
    if (!user) return null;

    return {
        ...user,
        id: user.id || user._id,
        name: user.name || user.Name || "",
        email: user.email || user.Email || "",
        role: user.role || "",
        collegeId: user.collegeId || user.College_Id,
    };
};

const readStoredSession = () => {
    const token = localStorage.getItem("token");
    const rawUser = localStorage.getItem("user");

    if (!token) {
        return { token: null, user: null };
    }

    try {
        return {
            token,
            user: rawUser ? normalizeUser(JSON.parse(rawUser)) : null,
        };
    } catch {
        localStorage.removeItem("user");
        return { token, user: null };
    }
};

const writeSession = ({ token, user }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(normalizeUser(user)));
};

const clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

export function AuthProvider({ children }) {
    const [session, setSession] = useState(readStoredSession);

    const logout = useCallback(() => {
        clearSession();
        setSession({ token: null, user: null });
    }, []);

    const login = useCallback(async ({ token, user }) => {
        const normalizedUser = normalizeUser(user);

        if (!token || !normalizedUser) {
            throw new Error("Login response did not include a valid session.");
        }

        writeSession({ token, user: normalizedUser });
        setSession({ token, user: normalizedUser });
        return { token, user: normalizedUser };
    }, []);

    const value = useMemo(() => {
        const role = session.user?.role;

        return {
            user: session.user,
            token: session.token,
            loading: false,
            isAuthenticated: Boolean(session.token && session.user),
            isAdmin: ADMIN_ROLES.includes(role),
            login,
            logout,
        };
    }, [login, logout, session.token, session.user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside an AuthProvider");
    }

    return context;
}
