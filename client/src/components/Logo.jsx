export default function Logo({ size = 44 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="DigiWallet logo"
    >
      <rect x="5" y="5" width="90" height="90" rx="22" fill="#dbeafe" />
      <path
        d="M50 20 L72 28 L72 50 C72 66 62 78 50 84 C38 78 28 66 28 50 L28 28 Z"
        fill="#1e3a8a"
      />
      <path
        d="M39 51 L47 59 L64 40"
        fill="none"
        stroke="#ffffff"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
