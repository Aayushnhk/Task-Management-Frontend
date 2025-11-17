// app/dashboard/page.tsx
import TaskDashboard from '@/components/tasks/TaskDashboard';
import { redirect } from 'next/navigation';


export default async function DashboardPage() {
 
  return <TaskDashboard />;
}