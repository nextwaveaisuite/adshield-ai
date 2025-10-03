export default function Dashboard({ title = 'Admin', children }) {
  return (
    <div style={{padding:'20px'}}>
      <h1>{title}</h1>
      <nav style={{display:'flex',gap:12,margin:'12px 0'}}>
        <a href="/admin">Overview</a>
        <a href="/admin/compliance">Compliance</a>
        <a href="/admin/usage">Usage</a>
        <a href="/admin/team">Team</a>
      </nav>
      <div>{children}</div>
    </div>
  );
}
