'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const router = useRouter()
  const supabase = createClient()
  
  const [mode, setMode] = useState(initialMode)
  const [authMethod, setAuthMethod] = useState('email') // 'email' | 'phone'
  
  // Form state
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [otp, setOtp] = useState('')
  
  // Registration Steps: 1 (Details), 2 (OTP), 3 (Set Password)
  const [step, setStep] = useState(1) 
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  // Sync mode when props change
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode)
      setStep(1)
      setError(null)
      setMessage(null)
      setOtp('')
      setPassword('')
    }
  }, [isOpen, initialMode])

  if (!isOpen) return null;

  // ==============================
  // LOGIN FLOW
  // ==============================
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const credentials = authMethod === 'email' 
        ? { email, password }
        : { phone, password }

      const { error } = await supabase.auth.signInWithPassword(credentials)
      if (error) throw error
      
      onClose()
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      console.error('Login Error:', err)
      setError(err.message || 'Invalid login credentials.')
    } finally {
      setLoading(false)
    }
  }

  // ==============================
  // REGISTRATION FLOW
  // ==============================
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
            data: { first_name: firstName, last_name: lastName }
          }
        })
        if (error) throw error
        setMessage(`We've sent a 6-digit code to ${email}`)
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          phone,
          options: {
            data: { first_name: firstName, last_name: lastName }
          }
        })
        if (error) throw error
        setMessage(`We've sent a 6-digit code to ${phone}`)
      }
      setStep(2)
    } catch (err) {
      console.error('OTP Request Error:', err)
      setError(err.message || 'Failed to send verification code.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.verifyOtp({
        email: authMethod === 'email' ? email : undefined,
        phone: authMethod === 'phone' ? phone : undefined,
        token: otp,
        type: authMethod === 'email' ? 'email' : 'sms',
      })

      if (error) throw error
      
      setStep(3)
      setMessage('Code verified! Please set a password for future logins.')
    } catch (err) {
      console.error('OTP Verify Error:', err)
      setError(err.message || 'Invalid or expired code.')
    } finally {
      setLoading(false)
    }
  }

  const handleSetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) throw error
      
      onClose()
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      console.error('Set Password Error:', err)
      setError(err.message || 'Failed to set password.')
    } finally {
      setLoading(false)
    }
  }

  // Handle click outside
  const handleBackdropClick = (e) => {
    if (e.target.id === 'modal-backdrop') {
      onClose()
    }
  }

  return (
    <div 
      id="modal-backdrop"
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="card w-full max-w-md animate-fade-in-up relative shadow-2xl border border-white/10">
        
        {/* Close Button — prominent X to dismiss modal */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-[var(--color-muted)] hover:text-white transition-all duration-200 hover:rotate-90 z-10"
          aria-label="Close modal"
          id="auth-modal-close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6 mt-2">
          <div className="flex justify-center mb-4">
            <Image src="/logo.svg" alt="EduPulse AI" width={48} height={48} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {mode === 'login' ? 'Welcome Back' : step === 3 ? 'Secure Your Account' : 'Create an Account'}
          </h2>
          <p className="text-sm text-[var(--color-muted)]">
            {mode === 'login' 
              ? 'Enter your credentials to access your dashboard'
              : step === 1 ? 'Sign up to start your journey' 
              : step === 2 ? 'Enter your verification code'
              : 'Set a password for future logins'
            }
          </p>
        </div>

        {/* Mode Toggle */}
        {(mode === 'login' || step === 1) && (
          <div className="flex border-b border-[var(--color-border)] mb-6">
            <button
              onClick={() => { setMode('login'); setError(null); setMessage(null); }}
              className={`flex-1 pb-3 text-sm font-medium transition-colors border-b-2 ${
                mode === 'login' ? 'border-[var(--color-accent-violet)] text-white' : 'border-transparent text-[var(--color-muted)] hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setMode('register'); setError(null); setMessage(null); }}
              className={`flex-1 pb-3 text-sm font-medium transition-colors border-b-2 ${
                mode === 'register' ? 'border-[var(--color-accent-violet)] text-white' : 'border-transparent text-[var(--color-muted)] hover:text-white'
              }`}
            >
              Register
            </button>
          </div>
        )}

        {/* Auth Method Toggle */}
        {(mode === 'login' || (mode === 'register' && step === 1)) && (
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
        )}

        {error && (
          <div className="p-3 mb-6 rounded-lg text-sm bg-red-500/10 border border-red-500/20 text-red-400">
            {error}
          </div>
        )}

        {message && (
          <div className="p-3 mb-6 rounded-lg text-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            {message}
          </div>
        )}

        {/* --- LOGIN VIEW --- */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
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
                <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">Phone Number</label>
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
            
            <div>
              <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-[var(--color-surface-light)] text-white border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent-violet)]"
                placeholder="••••••••"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full !py-3 mt-4">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        )}

        {/* --- REGISTER VIEW --- */}
        {mode === 'register' && (
          <>
            {step === 1 && (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">First Name</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-sm bg-[var(--color-surface-light)] text-white border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent-violet)]"
                      placeholder="Jane"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">Last Name</label>
                    <input
                      type="text"
                      required
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

                <button type="submit" disabled={loading} className="btn-primary w-full !py-3 mt-4">
                  {loading ? 'Sending code...' : 'Continue'}
                </button>
              </form>
            )}

            {step === 2 && (
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
                  <button type="submit" disabled={loading || otp.length < 6} className="btn-primary w-full !py-3 disabled:opacity-50">
                    {loading ? 'Verifying...' : 'Verify Code'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setStep(1); setOtp(''); setError(null); setMessage(null); }}
                    className="text-xs text-[var(--color-muted)] hover:text-white transition-colors"
                  >
                    Go Back
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleSetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-[var(--color-surface-light)] text-white border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent-violet)]"
                    placeholder="••••••••"
                  />
                  <p className="text-[10px] text-[var(--color-muted)] mt-1">Must be at least 6 characters.</p>
                </div>

                <button type="submit" disabled={loading || password.length < 6} className="btn-primary w-full !py-3 mt-4">
                  {loading ? 'Saving...' : 'Set Password & Complete Registration'}
                </button>
              </form>
            )}
          </>
        )}

      </div>
    </div>
  )
}
