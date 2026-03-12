export default function ImageKit() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {/* Blue background square with rounded corners */}
      <rect width="24" height="24" rx="4" fill="#145FDD" />
      {/* Dot above the i */}
      <circle cx="12" cy="4.5" r="1.6" fill="white" />
      {/* Italic "i" stem with curved tail */}
      <path
        d="M10.5 8.5 C11 8.5 12.5 8.3 12 10 L10.2 16.5 C9.9 17.5 10.2 18.2 11 18.5 C11.8 18.8 13 18.6 13.8 18 L13.4 19 C12.4 19.8 10.5 20 9.3 19.5 C8.1 19 7.6 17.8 8 16.5 L9.8 10 C10 9.2 9.8 8.8 9 8.8 Z"
        fill="white"
      />
    </svg>
  );
}
