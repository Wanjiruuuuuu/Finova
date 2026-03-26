export function FinovaLogo({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      {/* Upward trending line + leaf/spark */}
      <path
        d="M4 26 L12 18 L16 22 L28 6"
        stroke="#4edea3"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M22 6 L28 6 L28 12"
        stroke="#4edea3"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Leaf/spark accent */}
      <path
        d="M28 4 C28 4 30 8 28 12 C26 8 28 4 28 4Z"
        fill="#4edea3"
        opacity="0.3"
      />
    </svg>
  );
}
