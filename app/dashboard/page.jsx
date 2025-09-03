
import DashBoardComponent from '@/components/DashBoardComponent';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';


export default async function Dashboard() {
  
 const currentUser = await getCurrentUser();
 
 if (!currentUser) {
  redirect('/login')
 }

  return (
    <main className="min-h-screen bg-white text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      {/* Header */}
      <DashBoardComponent />
    </main>
  );
}
