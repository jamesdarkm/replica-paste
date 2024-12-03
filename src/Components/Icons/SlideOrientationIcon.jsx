export default function SlideOrientation({ className = "w-6 h-6" }) {
    return (
        <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <rect opacity="0.5" x="1" y="1" width="29" height="29" rx="1" stroke="black" stroke-width="2" />
            <rect x="16" y="3" width="12" height="25" fill="#D9D9D9" />
            <path d="M15.3077 19.238L19 15.619L15.3077 11.9999M18.4872 15.619H11" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}