interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export function Badge({ children, className = "", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-block px-3 py-1 text-sm font-semibold text-white ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
