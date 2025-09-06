

import React from 'react'
import LogoutButton from './LogoutButton';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = async () => {
   
 const currentUser = await getCurrentUser(); 
    return (
    <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/70 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
        <Link href="/" className="text-lg font-bold text-indigo-600">
        <Image
          src="/logo.png"
          alt="Logo"
          width={50}
          height={50}
        />
        </Link>
        </div>
        <div className='flex items-center gap-2'>
             { currentUser?.email && <Link href="/dashboard" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-900">Dashboard</Link>}
          {currentUser?.email && <LogoutButton />}
     
        </div>
        { !currentUser?.email && 
          <div className="flex gap-2">
            <Link
              href="/register"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-900"
            >
              Register
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
            >
              Login
            </Link>
          </div>
        }
      </div>
    </div>
  )
}

export default Navbar