import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req) {
  try {
    const supabase = await createClient()
    
    // Authenticate user securely on the server
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let payload;
    // Handle navigator.sendBeacon which sends raw text sometimes
    const text = await req.text()
    try {
      payload = JSON.parse(text)
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const { action_type, metadata } = payload
    if (!action_type) {
      return NextResponse.json({ error: 'Missing action_type' }, { status: 400 })
    }

    // Insert log into the database
    const { error } = await supabase.from('activity_logs').insert({
      user_id: session.user.id,
      action_type,
      metadata
    })

    if (error) {
      console.error('Tracking DB Error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Tracking Route Error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
