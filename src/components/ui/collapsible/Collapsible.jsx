export function Collapsible({ children, defaultOpen, className }) {
  return (
    <div
      className={`collapsible ${className}`}
      data-state={defaultOpen ? "open" : "closed"}
    >
      {children}
    </div>
  );
}
