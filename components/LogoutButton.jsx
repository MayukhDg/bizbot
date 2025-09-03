"use client"


import React from 'react'
import { useRouter } from 'next/navigation';


const LogoutButton = () => {
  
  
  const router = useRouter();
   const logout = async () => {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    if (res.ok) {
        // Handle successful logout (e.g., redirect to login page)
        router.push("/login");
      }
  };
    return (
    <button 
          onClick={logout}
          className="text-xs rounded-lg border border-slate-300 px-3 py-1 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
        >
          Logout
        </button>
  )
}

export default LogoutButton