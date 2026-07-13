import "./TopNavbar.css";

export default function TopNavbar() {

    const college = JSON.parse(localStorage.getItem("user"));

    return (

        <header className="top-navbar">

            <div>

                <h2>Dashboard</h2>

                <p>
                    Welcome back,
                    <strong> {college?.name}</strong>
                    {/* this is supposed to show the college name, since superadmin is not ready yet, it's a placeholder */}
                </p>

            </div>

            <div className="profile">

                <div className="profile-circle">

                    {college?.name?.charAt(0)}
{/* gives first letter of the college name */}
                </div>

            </div>

        </header>

    );
}