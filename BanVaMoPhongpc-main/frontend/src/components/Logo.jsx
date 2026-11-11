// Logo KaDa Store (SVG). light = chữ trắng dùng trên nền tối, sub = dòng chữ nhỏ bên dưới.
export default function Logo({ light = false, sub = "STORE" }) {
  return (
    <span className="logo">
      <svg className="logoMark" viewBox="0 0 48 48" aria-hidden="true">
        <defs>
          <linearGradient id="kg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2b9bf0" />
            <stop offset="1" stopColor="#0660ad" />
          </linearGradient>
        </defs>
        <rect width="48" height="48" rx="11" fill="url(#kg)" />
        <path d="M15 11v26M15 24l15-13M20 22l12 15" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="35" cy="12" r="2.6" fill="#ffd166" stroke="none" />
      </svg>
      <span className={"logoText" + (light ? " light" : "")}>
        <b>Ka<em>Da</em></b>
        <small>{sub}</small>
      </span>
    </span>
  );
}
