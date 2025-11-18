import { useState } from 'react'

export default function AuthForm({ onAuth }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const backend = import.meta.env.VITE_BACKEND_URL

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (mode === 'login') {
        const res = await fetch(`${backend}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, password: form.password })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.detail || 'Login failed')
        onAuth(data)
      } else {
        const res = await fetch(`${backend}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: form.name, email: form.email, password: form.password, role: form.role })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.detail || 'Registration failed')
        alert(data.requires_admin_verification ? 'Registered! Waiting for admin verification.' : 'Registered! You can log in now.')
        setMode('login')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700 w-full max-w-md">
      <div className="flex gap-2 mb-4">
        <button className={`px-3 py-1 rounded ${mode==='login'?'bg-blue-600 text-white':'bg-slate-700 text-slate-200'}`} onClick={() => setMode('login')}>Login</button>
        <button className={`px-3 py-1 rounded ${mode==='register'?'bg-blue-600 text-white':'bg-slate-700 text-slate-200'}`} onClick={() => setMode('register')}>Register</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === 'register' && (
          <input className="w-full px-3 py-2 rounded bg-slate-700 text-white" placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
        )}
        <input className="w-full px-3 py-2 rounded bg-slate-700 text-white" type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
        <input className="w-full px-3 py-2 rounded bg-slate-700 text-white" type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
        {mode === 'register' && (
          <select className="w-full px-3 py-2 rounded bg-slate-700 text-white" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        )}
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button disabled={loading} className="w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50">{loading? 'Please wait...' : (mode==='login'?'Login':'Create Account')}</button>
      </form>
    </div>
  )
}
