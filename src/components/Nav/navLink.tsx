import Link from 'next/link'
import { useRouter } from 'next/router'

function NavLink(props) {
  const router = useRouter()
  const matchRouteClass = router.pathname === props.item.to ? "text-gray-900" : "bg-gray-200";
  return (
    <>
      <Link href={props.item.to}>
        <a className={matchRouteClass} onClick={props.closeDrawer}>{props.item.label}</a>
      </Link>
      <style jsx>{`
      .link {
          padding: 1rem;
          font-size: 1.2rem;
          font-weight: 600;
          border-bottom: 1px solid #ccc;
        }

        .link:hover {
          background: #bbb;
        }
      `}</style>
    </>
  )
}