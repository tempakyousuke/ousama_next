import Link from 'next/link'
import { useRouter } from 'next/router'

function NavLink(props) {
  const router = useRouter()
  const matchRouteClass = "link " + (router.pathname === props.item.to ? "text-gray-900" : "");
  return (
    <div>
      <Link href={props.item.to}>
        <div className={matchRouteClass} onClick={props.closeDrawer}>{props.item.label}</div>
      </Link>
      <style jsx>{`
        .link {
          padding: 1rem;
          font-size: 1.25rem;
          font-weight: 600;
          border-bottom: 1px solid #ccc;
        }

        .link:hover {
          background: #ccc;
        }
      `}</style>
    </div>
  )
}

export default NavLink