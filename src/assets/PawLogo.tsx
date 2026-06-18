export default function PawLogo({ size = 120 }: { size?: number }) {
  return (
    <img
      src="/nintendogs-logo.png"
      alt="Nintendogs"
      width={size}
      height={size}
      style={{ objectFit: 'contain', display: 'block' }}
      draggable={false}
    />
  )
}
