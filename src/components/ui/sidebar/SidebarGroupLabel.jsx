export function SidebarGroupLabel({ children, asChild }) {
    const Tag = asChild ? 'div' : 'span';
    return <Tag className="sidebar-group-label">{children}</Tag>;
  }