export default function Dashboard({ title = 'Admin', children }) {
  return (
    <div style={{padding:'20px'}}>
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h1>{title}</h1>
        <nav style={{display:'flex',gap:12}}>
          <a href="/admin">Overview</a>
          <a href="/admin/compliance">Compliance</a>
          <a href="/admin/usage">Usage</a>
          <a href="/admin/team">Team</a>
        </nav>
      </header>
      <div style={{marginTop:16}}>{children}</div>
    </div>
  );
}
