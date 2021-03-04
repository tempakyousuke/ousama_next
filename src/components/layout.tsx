import Nav from './Nav/nav'

function Layout({children}) {
  return (
    <div>
      <Nav />
      <div className="bg-amber-50">
      {children}
      </div>
    </div>
  )
}

export default Layout