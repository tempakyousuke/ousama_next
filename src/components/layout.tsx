import Nav from './Nav/nav'

function Layout({children}) {
  return (
    <div>
      <Nav />
      <div className="bg-amber-100">
      {children}
      </div>
    </div>
  )
}

export default Layout