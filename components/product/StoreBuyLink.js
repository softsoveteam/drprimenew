export default function StoreBuyLink({
  href,
  className = "btn-default",
  inStock = true,
  children,
  onClick,
}) {
  if (!inStock) {
    return (
      <span className={`${className} is-disabled`} aria-disabled="true">
        Out of Stock
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={onClick}
    >
      {children}
    </a>
  );
}
