import { useState } from 'react'
import AuthForm from './components/AuthForm'
import Dashboard from './components/Dashboard'

function App() {
  const [auth, setAuth] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      <div className="relative min-h-screen p-6 max-w-6xl mx-auto">
        <header className="py-6 text-center">
          <h1 className="text-4xl font-bold text-white tracking-tight">Classroom Scheduler</h1>
          <p className="text-blue-200/80 mt-2">Teachers create tasks and events. Students see a calendar and get deadline notifications.</p>
        </header>
        <main className="mt-4">
          {!auth ? (
            <div className="flex items-center justify-center">
              <AuthForm onAuth={setAuth} />
            </div>
          ) : (
            <Dashboard auth={auth} onLogout={()=>setAuth(null)} />
          )}
        </main>
      </div>
    </div>
  )
}

export default App
