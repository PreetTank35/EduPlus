'use client'

import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'

export default function AnalyticsDashboardClient({ logs, topPaths }) {
  
  // Aggregate events by day
  const dailyData = useMemo(() => {
    const days = {}
    logs.forEach(log => {
      // Group by date string (YYYY-MM-DD)
      const date = new Date(log.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      if (!days[date]) days[date] = { date, page_views: 0, clicks: 0, forms: 0 }
      
      if (log.action_type === 'page_view') days[date].page_views += 1
      if (log.action_type === 'click') days[date].clicks += 1
      if (log.action_type === 'form_submit') days[date].forms += 1
    })
    return Object.values(days).reverse() // Chronological order
  }, [logs])

  // Aggregate event types for pie chart
  const eventTypesData = useMemo(() => {
    const types = { 'Page Views': 0, 'Clicks': 0, 'Time Trackers': 0, 'Forms': 0 }
    logs.forEach(log => {
      if (log.action_type === 'page_view') types['Page Views'] += 1
      else if (log.action_type === 'click') types['Clicks'] += 1
      else if (log.action_type === 'time_spent') types['Time Trackers'] += 1
      else if (log.action_type === 'form_submit') types['Forms'] += 1
    })
    return Object.entries(types)
      .map(([name, value]) => ({ name, value }))
      .filter(t => t.value > 0)
  }, [logs])

  const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b']

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Main Activity Timeline */}
      <div className="lg:col-span-2 card">
        <h3 className="text-lg font-bold text-white mb-6">Activity Timeline (Recent)</h3>
        <div className="h-72 w-full">
          {dailyData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="page_views" name="Page Views" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="clicks" name="Clicks" fill="#06b6d4" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-[var(--color-muted)] text-sm">
              Not enough data yet
            </div>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {/* Event Breakdown */}
        <div className="card">
          <h3 className="text-lg font-bold text-white mb-4">Event Breakdown</h3>
          <div className="h-48 w-full">
            {eventTypesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={eventTypesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {eventTypesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-[var(--color-muted)] text-sm">
                No events
              </div>
            )}
          </div>
        </div>

        {/* Top Pages */}
        <div className="card">
          <h3 className="text-lg font-bold text-white mb-4">Top Pages</h3>
          {topPaths.length > 0 ? (
            <ul className="space-y-3">
              {topPaths.map((item, idx) => (
                <li key={idx} className="flex justify-between items-center text-sm border-b border-[var(--color-border)] pb-2 last:border-0 last:pb-0">
                  <span className="text-[var(--color-muted)] truncate mr-4">{item.path}</span>
                  <span className="text-white font-medium bg-[var(--color-surface-light)] px-2 py-0.5 rounded-full">{item.count}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[var(--color-muted)] text-sm">No page data</p>
          )}
        </div>
      </div>

    </div>
  )
}
