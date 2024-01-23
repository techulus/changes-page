export default function OptionalLink({
  href,
  children,
}: {
  href: string | null;
  children: React.ReactNode;
}) {
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return <>{children}</>;
}
