import Link from 'next/link'
import Drawer from './drawer'
import { useState } from 'react';

function Nav() {
  const [open, setOpen] = useState(false);
  let closeDrawer = () => { setOpen(false) };

  return (
    <div className="w-full bg-warmGray-200 text-amber-1100 shadow-2xl">
      <div className="flex flex-col max-w-screen-xl px-4 mx-auto">
        <div className="p-4 flex flex-row items-center justify-between">
          <Link href="/">
            <a className="text-lg font-semibold tracking-widest">王様のかくれんぼ</a>
          </Link>
          <button className="rounded-lg focus:outline-none focus:shadow-outline" onClick={() => {setOpen(true)}}>
            <svg className="w-6 h-6" fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z' clipRule='evenodd' />
            </svg>
          </button>
        </div>
      </div>
      <Drawer open={open} close={closeDrawer} />
    </div>
  )
}

export default Nav