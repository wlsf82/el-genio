export const Show = ({
  children,
  when,
  fallback,
}: {
  children: React.ReactNode
  when: boolean
  fallback?: React.ReactNode
}) => {
  if (!when) return fallback
  return children
}
