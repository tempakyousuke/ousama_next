import Nav from "./Nav/nav";

function Layout({ children }: { children: JSX.Element }): JSX.Element {
  return (
    <div>
      <Nav />
      <div className="bg-amber-50">{children}</div>
    </div>
  );
}

export default Layout;
