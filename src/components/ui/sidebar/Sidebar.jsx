export function Sidebar({ children, collapsible }) {
    return (
      <div className={`sidebar ${collapsible ? 'collapsible' : ''}`}>{children}</div>
    );
  }