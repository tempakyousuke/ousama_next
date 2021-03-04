import menus from "./menus"
import AccordionButton from "./accordionButton"
import NavLink from "./navLink"
import React from "react"

function AccordionMenu(props) {
  const navi = menus.map(menu => {
    if (menu.children) {
      return <AccordionButton item={menu} closeDrawer={props.closeDrawer} key={menu.label} />
    } else {
      return <NavLink item={menu} closeDrawer={props.closeDrawer} key={menu.to} />
    }
  })
  return (
    <div className="py-2">
      <div className="mt-5 font-bold p-4 text-xl">王様のかくれんぼ</div>
      {navi}
      <div className="p-4 md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline text-xl">ログアウト</div>
    </div>
  )
}

export default AccordionMenu