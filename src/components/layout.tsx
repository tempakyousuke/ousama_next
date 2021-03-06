import Nav from "./Nav/nav";

function Layout({ children }: { children: JSX.Element }): JSX.Element {
  return (
    <div>
      <Nav />
      <div className="container mx-auto">{children}</div>
    </div>
  );
}

export default Layout;
