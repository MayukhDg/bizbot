
import RegisterComponent from "@/components/RegisterComponent";
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';


export default async function Register() {
  const currentUser = await getCurrentUser();
 
 if (currentUser) {
  redirect('/dashboard')
 }


  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
      <RegisterComponent/>
    </main>
  );
}
