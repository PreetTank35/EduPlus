'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'

export default function AuthPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [authMethod, setAuthMethod] = useState('email') // 'email' or 'phone'
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  
  // Profile info for new users
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState(1) // 1: Request OTP, 2: Verify OTP
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  const handleRequestOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (authMethod === 'email') {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName
            }
          }
        })
        if (error) throw error
        setMessage(`We've sent a 6-digit code to ${email}`)
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          phone,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName
            }
          }
        })
        if (error) throw error
        setMessage(`We've sent a 6-digit code to ${phone}`)
      }
      setStep(2)
    } catch (err) {
      console.error('OTP Request Error:', err)
      setError(err.message || 'Failed to send verification code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: authMethod === 'email' ? email : undefined,
        phone: authMethod === 'phone' ? phone : undefined,
        token: otp,
        type: authMethod === 'email' ? 'email' : 'sms',
      })

      if (error) throw error
      
      // Successfully authenticated
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      console.error('OTP Verify Error:', err)
      setError(err.message || 'Invalid or expired code.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4">
      <div className="card w-full max-w-md animate-fade-in-up">
        
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image src="/logo.svg" alt="EduPulse AI" width={48} height={48} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome to EduPulse</h1>
          <p className="text-sm text-[var(--color-muted)]">
            {step === 1 ? 'Sign in or create an account to continue' : 'Enter your verification code'}
          </p>
        </div>

        {error && (
          <div className="p-3 mb-6 rounded-lg text-sm bg-red-500/10 border border-red-500/20 text-red-400">
            {error}
          </div>
        )}

        {message && step === 2 && (
          <div className="p-3 mb-6 rounded-lg text-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            {message}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            
            {/* Auth Method Toggle */}
            <div className="flex p-1 bg-[var(--color-surface-light)] rounded-xl border border-[var(--color-border)] mb-6">
              <button
                type="button"
                onClick={() => setAuthMethod('email')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                  authMethod === 'email' 
                    ? 'bg-[var(--color-surface)] text-white shadow' 
                    : 'text-[var(--color-muted)] hover:text-white'
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('phone')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                  authMethod === 'phone' 
                    ? 'bg-[var(--color-surface)] text-white shadow' 
                    : 'text-[var(--color-muted)] hover:text-white'
                }`}
              >
                Phone
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">First Name (Optional)</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-[var(--color-surface-light)] text-white border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent-violet)]"
                  placeholder="Jane"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">Last Name (Optional)</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-[var(--color-surface-light)] text-white border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent-violet)]"
                  placeholder="Doe"
                />
              </div>
            </div>

            {authMethod === 'email' ? (
              <div>
                <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-[var(--color-surface-light)] text-white border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent-violet)]"
                  placeholder="jane@example.com"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">Phone Number (with country code)</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-[var(--color-surface-light)] text-white border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent-violet)]"
                  placeholder="+1234567890"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-3 mt-4"
            >
              {loading ? 'Sending code...' : 'Send Verification Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[var(--color-muted)] mb-3 text-center">
                6-Digit OTP Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 rounded-xl text-2xl tracking-[0.5em] text-center bg-[var(--color-surface-light)] text-white border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent-violet)]"
                placeholder="000000"
              />
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="btn-primary w-full !py-3 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setStep(1)
                  setOtp('')
                  setError(null)
                  setMessage(null)
                }}
                className="text-xs text-[var(--color-muted)] hover:text-white transition-colors"
              >
                Use a different {authMethod}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
