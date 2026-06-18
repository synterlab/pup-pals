export default function PawLogo({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main paw pad */}
      <ellipse cx="48" cy="58" rx="26" ry="24" fill="#FF8B6A" />
      {/* Toe pads */}
      <ellipse cx="26" cy="40" rx="10" ry="12" fill="#FF8B6A" />
      <ellipse cx="40" cy="32" rx="10" ry="12" fill="#FF8B6A" />
      <ellipse cx="56" cy="32" rx="10" ry="12" fill="#FF8B6A" />
      <ellipse cx="70" cy="40" rx="10" ry="12" fill="#FF8B6A" />
      {/* Inner main pad */}
      <ellipse cx="48" cy="59" rx="18" ry="16" fill="#E8664A" opacity="0.35" />
      {/* Heart detail on main pad */}
      <path d="M44 56 C44 53 40 51 40 55 C40 58 44 61 48 64 C52 61 56 58 56 55 C56 51 52 53 52 56 C52 53 48 51 48 55 C48 51 44 53 44 56Z" fill="white" opacity="0.25" />
    </svg>
  )
}
