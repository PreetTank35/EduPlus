'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

/**
 * ActivityTracker — Global client-side tracking component
 * 
 * Automatically tracks:
 * 1. Page views
 * 2. Time spent on a page (sends on unload or route change)
 * 3. Button clicks (when elements have an id or button tag)
 * 4. Form submissions
 */
export default function ActivityTracker() {
  const pathname = usePathname()
  const supabase = createClient()
  
  // Track time spent
  const timeStartRef = useRef(Date.now())
  const lastPathnameRef = useRef(pathname)

  // Track an event
  const trackEvent = async (actionType, metadata = {}) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user?.id) return // Don't track unauthenticated users (or tracking fails at RLS anyway)

      // Send via beacon if unloading, else fetch
      if (metadata.isUnload) {
        // Beacon API is better for page unloads
        const payload = JSON.stringify({
          action_type: actionType,
          metadata: { ...metadata, url: window.location.href, pathname: lastPathnameRef.current }
        })
        navigator.sendBeacon('/api/track', payload)
      } else {
        await fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action_type: actionType,
            metadata: { ...metadata, url: window.location.href, pathname }
          }),
          // Use keepalive for route transitions
          keepalive: metadata.isRouteTransition || false
        })
      }
    } catch (e) {
      console.error('Tracking failed:', e)
    }
  }

  // 1. Page Views & Route Transitions (Time Spent)
  useEffect(() => {
    // If the path changed, log the time spent on the previous path
    if (lastPathnameRef.current !== pathname) {
      const timeSpentSecs = Math.floor((Date.now() - timeStartRef.current) / 1000)
      trackEvent('time_spent', { 
        duration_seconds: timeSpentSecs, 
        pathname: lastPathnameRef.current,
        isRouteTransition: true
      })
      
      // Reset timer and log new page view
      timeStartRef.current = Date.now()
      lastPathnameRef.current = pathname
      trackEvent('page_view', { title: document.title })
    } else {
      // First load page view
      trackEvent('page_view', { title: document.title })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // 2. Unload / Close Window (Time Spent)
  useEffect(() => {
    const handleBeforeUnload = () => {
      const timeSpentSecs = Math.floor((Date.now() - timeStartRef.current) / 1000)
      trackEvent('time_spent', { 
        duration_seconds: timeSpentSecs,
        pathname: lastPathnameRef.current,
        isUnload: true 
      })
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  // 3. Global Clicks & Form Submissions
  useEffect(() => {
    const handleClick = (e) => {
      // Find closest button or anchor
      const target = e.target.closest('button, a, [role="button"]')
      if (target) {
        trackEvent('click', {
          element: target.tagName,
          id: target.id || undefined,
          text: target.innerText?.substring(0, 50) || undefined,
          href: target.href || undefined
        })
      }
    }

    const handleSubmit = (e) => {
      trackEvent('form_submit', {
        id: e.target.id || undefined,
        action: e.target.action || undefined
      })
    }

    document.addEventListener('click', handleClick, { passive: true })
    document.addEventListener('submit', handleSubmit, { passive: true })

    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('submit', handleSubmit)
    }
  }, [pathname])

  return null // Render nothing
}
