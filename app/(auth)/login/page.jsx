
import LoginComponent from "@/components/LoginComponent";
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Login() {
  
 const currentUser = await getCurrentUser();
 
 if (currentUser) {
  redirect('/dashboard')
 }


  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 flex items-center justify-center px-4">
      <LoginComponent />
    </main>
  );
}
