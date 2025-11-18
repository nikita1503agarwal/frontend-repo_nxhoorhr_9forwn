import { useEffect, useMemo, useState } from 'react'

function Header({ user, onLogout }){
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-white text-2xl font-semibold">Welcome, {user.name}</h2>
      <div className="flex items-center gap-2">
        <span className="text-slate-300 text-sm px-2 py-1 rounded bg-slate-700">{user.role}</span>
        <button onClick={onLogout} className="px-3 py-1 rounded bg-slate-700 text-slate-200 hover:bg-slate-600">Logout</button>
      </div>
    </div>
  )
}

function CreateItem({ token, user, refresh }){
  const [tab, setTab] = useState('task')
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [due, setDue] = useState('')
  const [audience, setAudience] = useState('all_students')
  const backend = import.meta.env.VITE_BACKEND_URL

  if (user.role !== 'teacher') return null

  async function submitTask(){
    const res = await fetch(`${backend}/tasks`,{
      method:'POST', headers:{'Content-Type':'application/json','X-Auth-Token': token,'X-User-Id': user.id},
      body: JSON.stringify({ title, description: desc, due_date: new Date(due).toISOString(), audience })
    })
    if(res.ok){ setTitle(''); setDesc(''); setDue(''); refresh() }
  }
  async function submitEvent(){
    const res = await fetch(`${backend}/events`,{
      method:'POST', headers:{'Content-Type':'application/json','X-Auth-Token': token,'X-User-Id': user.id},
      body: JSON.stringify({ title, description: desc, start_time: new Date(start).toISOString(), end_time: new Date(end).toISOString(), audience })
    })
    if(res.ok){ setTitle(''); setDesc(''); setStart(''); setEnd(''); refresh() }
  }

  return (
    <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 mb-6">
      <div className="flex gap-2 mb-3">
        <button onClick={()=>setTab('task')} className={`px-3 py-1 rounded ${tab==='task'?'bg-blue-600 text-white':'bg-slate-700 text-slate-200'}`}>New Task</button>
        <button onClick={()=>setTab('event')} className={`px-3 py-1 rounded ${tab==='event'?'bg-blue-600 text-white':'bg-slate-700 text-slate-200'}`}>New Event</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        <input className="px-3 py-2 rounded bg-slate-700 text-white md:col-span-2" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <input className="px-3 py-2 rounded bg-slate-700 text-white md:col-span-3" placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} />
        {tab==='task' ? (
          <input className="px-3 py-2 rounded bg-slate-700 text-white" type="datetime-local" value={due} onChange={e=>setDue(e.target.value)} />
        ) : (
          <>
            <input className="px-3 py-2 rounded bg-slate-700 text-white" type="datetime-local" value={start} onChange={e=>setStart(e.target.value)} />
            <input className="px-3 py-2 rounded bg-slate-700 text-white" type="datetime-local" value={end} onChange={e=>setEnd(e.target.value)} />
          </>
        )}
        <select className="px-3 py-2 rounded bg-slate-700 text-white" value={audience} onChange={e=>setAudience(e.target.value)}>
          <option value="all_students">All students</option>
          <option value="specific" disabled>Specific (UI not implemented)</option>
        </select>
        <button onClick={tab==='task'?submitTask:submitEvent} className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-500">Create</button>
      </div>
    </div>
  )
}

function Calendar({ items }){
  // simple month grouping
  const groups = useMemo(()=>{
    const map = {}
    items.forEach(it=>{
      const d = new Date(it.date)
      const key = `${d.getFullYear()}-${d.getMonth()+1}`
      map[key] = map[key]||[]
      map[key].push(it)
    })
    return map
  },[items])

  const keys = Object.keys(groups).sort()

  return (
    <div className="space-y-4">
      {keys.map(k=> (
        <div key={k} className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
          <div className="text-slate-200 font-medium mb-2">{k}</div>
          <div className="grid grid-cols-1 gap-2">
            {groups[k].sort((a,b)=> new Date(a.date)-new Date(b.date)).map((it, idx)=> (
              <div key={idx} className="flex items-center justify-between bg-slate-900/60 p-3 rounded border border-slate-700">
                <div>
                  <div className="text-white font-semibold">{it.title}</div>
                  <div className="text-slate-300 text-sm">{it.type} • {new Date(it.date).toLocaleString()}</div>
                </div>
                {it.type==='task' && new Date(it.date) < new Date() && (
                  <span className="text-xs px-2 py-1 rounded bg-red-600 text-white">Deadline reached</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function Lists({ tasks, events }){
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
        <div className="text-white font-semibold mb-2">Tasks</div>
        <div className="space-y-2">
          {tasks.map(t=> (
            <div key={t.id} className="p-3 rounded bg-slate-900/60 border border-slate-700">
              <div className="text-white font-medium">{t.title}</div>
              <div className="text-slate-300 text-sm">Due: {new Date(t.due_date).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
        <div className="text-white font-semibold mb-2">Events</div>
        <div className="space-y-2">
          {events.map(e=> (
            <div key={e.id} className="p-3 rounded bg-slate-900/60 border border-slate-700">
              <div className="text-white font-medium">{e.title}</div>
              <div className="text-slate-300 text-sm">Start: {new Date(e.start_time).toLocaleString()} • End: {new Date(e.end_time).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Dashboard({ auth, onLogout }){
  const { token, user } = auth
  const backend = import.meta.env.VITE_BACKEND_URL
  const [tasks, setTasks] = useState([])
  const [events, setEvents] = useState([])
  const [notifs, setNotifs] = useState([])

  async function load(){
    const [tRes, eRes, nRes] = await Promise.all([
      fetch(`${backend}/my/tasks`, { headers: { 'X-Auth-Token': token, 'X-User-Id': user.id }}),
      fetch(`${backend}/my/events`, { headers: { 'X-Auth-Token': token, 'X-User-Id': user.id }}),
      fetch(`${backend}/my/notifications`, { headers: { 'X-Auth-Token': token, 'X-User-Id': user.id }})
    ])
    setTasks(await tRes.json())
    setEvents(await eRes.json())
    setNotifs(await nRes.json())
  }

  useEffect(()=>{ load() },[])

  const calendarItems = [
    ...tasks.map(t=> ({ type: 'task', title: t.title, date: t.due_date })),
    ...events.map(e=> ({ type: 'event', title: e.title, date: e.start_time }))
  ]

  return (
    <div>
      <Header user={user} onLogout={onLogout} />
      <CreateItem token={token} user={user} refresh={load} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="text-white text-xl font-semibold mb-3">Calendar</div>
          <Calendar items={calendarItems} />
        </div>
        <div className="lg:col-span-1">
          <div className="text-white text-xl font-semibold mb-3">Notifications</div>
          <div className="space-y-2">
            {notifs.map(n => (
              <div key={n.id} className="p-3 rounded bg-slate-800/60 border border-slate-700">
                <div className="text-white font-medium">{n.title}</div>
                <div className="text-slate-300 text-sm">{n.message}</div>
              </div>
            ))}
            {notifs.length===0 && <div className="text-slate-400">No notifications yet.</div>}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="text-slate-300 text-sm">Deadline notifications are generated automatically when due dates pass. You can also trigger it manually.</div>
        <button className="mt-2 px-3 py-2 rounded bg-slate-700 text-slate-200 hover:bg-slate-600" onClick={async()=>{ await fetch(`${backend}/cron/generate-deadline-notifs`, { method:'POST' }); load() }}>Run notification sweep</button>
      </div>
    </div>
  )
}
