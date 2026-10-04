interface WordmarkProps {
  className?: string
}

export function Wordmark({ className = '' }: WordmarkProps) {
  return (
    <span className={`font-display text-2xl font-bold tracking-tight ${className}`}>
      <span className="text-ink">Blocker</span>
      <span className="text-primary">flow</span>
    </span>
  )
}
