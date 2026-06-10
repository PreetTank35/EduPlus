import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AnalyticsDashboardClient from './AnalyticsDashboardClient'

export const metadata = {
  title: 'Activity Analytics | EduPulse AI',
}

export default async function AnalyticsPage() {
  const supabase = await createClient()

  // Ensure user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  // Fetch all activity logs for this user
  const { data: logs, error } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching analytics:', error)
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card text-center p-8">
          <h2 className="text-xl font-bold text-red-400 mb-2">Error loading analytics</h2>
          <p className="text-[var(--color-muted)]">Please try again later.</p>
        </div>
      </div>
    )
  }

  // Pre-process metrics
  const totalEvents = logs.length
  const pageViews = logs.filter(log => log.action_type === 'page_view').length
  const clicks = logs.filter(log => log.action_type === 'click').length
  
  const timeLogs = logs.filter(log => log.action_type === 'time_spent')
  const totalTimeSpentSecs = timeLogs.reduce((acc, curr) => acc + (curr.metadata?.duration_seconds || 0), 0)
  const avgSessionMins = timeLogs.length > 0 
    ? Math.round((totalTimeSpentSecs / timeLogs.length) / 60) 
    : 0

  // Top paths
  const pathCounts = {}
  logs.forEach(log => {
    const path = log.metadata?.pathname
    if (path) {
      pathCounts[path] = (pathCounts[path] || 0) + 1
    }
  })
  const topPaths = Object.entries(pathCounts)
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const metrics = {
    totalEvents,
    pageViews,
    clicks,
    avgSessionMins,
    topPaths
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Your Activity Analytics</h1>
        <p className="text-[var(--color-muted)]">Insights into your engagement with the platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <p className="text-sm font-medium text-[var(--color-muted)] mb-1">Total Page Views</p>
          <p className="text-3xl font-bold text-white">{pageViews}</p>
        </div>
        <div className="card">
          <p className="text-sm font-medium text-[var(--color-muted)] mb-1">Total Interactions</p>
          <p className="text-3xl font-bold text-white">{clicks}</p>
        </div>
        <div className="card">
          <p className="text-sm font-medium text-[var(--color-muted)] mb-1">Avg Time on Page</p>
          <p className="text-3xl font-bold text-white">{avgSessionMins} <span className="text-lg text-[var(--color-muted)]">min</span></p>
        </div>
        <div className="card">
          <p className="text-sm font-medium text-[var(--color-muted)] mb-1">Total Events Logged</p>
          <p className="text-3xl font-bold text-white">{totalEvents}</p>
        </div>
      </div>

      {/* Render Client Component for charts */}
      <AnalyticsDashboardClient logs={logs} topPaths={topPaths} />
      
    </div>
  )
}
