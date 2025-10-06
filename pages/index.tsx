import { useEffect, useState } from 'react'
import Head from 'next/head'
import CryptoJS from 'crypto-js'

type VaultItem = {
  _id: string
  title: string
  username: string
  ciphertext: string
  iv?: string
  createdAt?: string
}

type User = {
  email: string
  kdfSalt: string
}

export default function Home(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [user,setUser]=useState<User | null>(null)
  const [kdfSalt,setKdfSalt]=useState<string | null>(null)
  const [items,setItems]=useState<VaultItem[]>([])
  const [search,setSearch]=useState('')
  const [copyTimer,setCopyTimer]=useState<number|null>(null)
  const [genOpts,setGenOpts]=useState({length:16,upper:true,lower:true,numbers:true,symbols:true,excludeLookalikes:true})
  const [genPassword,setGenPassword]=useState('')
  const [loading,setLoading]=useState(false)

  useEffect(()=>{ // try fetch session
    fetch('/api/auth/me').then(r=>r.json()).then(j=>{
      if(j?.email){ setUser(j); setKdfSalt(j.kdfSalt) ; fetchVault(j.email) }
    })
  },[])

  async function register(){
    if(!email || !password) return alert('Please enter email and password')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,password})})
      const j = await res.json()
      if(res.ok){ alert('Registered successfully! Please login.'); }
      else alert(j.error||'Registration failed')
    } catch(e) {
      alert('Network error')
    }
    setLoading(false)
  }
  async function login(){
    if(!email || !password) return alert('Please enter email and password')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,password})})
      const j = await res.json()
      if(res.ok){ setUser(j.user); setKdfSalt(j.user.kdfSalt); fetchVault(j.user.email); alert('Logged in successfully!') }
      else alert(j.error||'Login failed')
    } catch(e) {
      alert('Network error')
    }
    setLoading(false)
  }
  async function logout(){
    await fetch('/api/auth/logout'); setUser(null); setItems([]); setKdfSalt(null);
  }

  async function fetchVault(email:string){
    const res = await fetch('/api/vault/list')
    const j = await res.json()
    setItems(j.items||[])
  }

  // derive key from password + salt (PBKDF2)
  function deriveKey(password:string, salt:string){
    const key = CryptoJS.PBKDF2(password, salt, { keySize: 256/32, iterations: 1000 }).toString()
    return key
  }

  function encryptItem(plainObj:any){
    if(!kdfSalt) throw new Error('no salt')
    const key = CryptoJS.enc.Hex.parse(deriveKey(password,kdfSalt))
    const iv = CryptoJS.lib.WordArray.random(16)
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(plainObj), key, { iv }).toString()
    return { ciphertext, iv: iv.toString() }
  }
  function decryptItem(ciphertext:string, ivHex:string){
    if(!kdfSalt) throw new Error('no salt')
    const key = CryptoJS.enc.Hex.parse(deriveKey(password,kdfSalt))
    try{
      const bytes = CryptoJS.AES.decrypt(ciphertext, key, { iv: CryptoJS.enc.Hex.parse(ivHex) })
      const txt = bytes.toString(CryptoJS.enc.Utf8)
      return JSON.parse(txt)
    }catch(e){
      return null
    }
  }

  async function saveItem(){
    const title = (document.getElementById('title') as HTMLInputElement).value || 'untitled'
    const username = (document.getElementById('username') as HTMLInputElement).value || ''
    const pwd = (document.getElementById('pwd') as HTMLInputElement).value || ''
    const url = (document.getElementById('url') as HTMLInputElement).value || ''
    const notes = (document.getElementById('notes') as HTMLTextAreaElement).value || ''
    const plain = { title, username, password: pwd, url, notes }
    const enc = encryptItem(plain)
    const res = await fetch('/api/vault/create',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(enc)})
    const j = await res.json()
    if(res.ok){ fetchVault(user.email); (document.getElementById('title') as HTMLInputElement).value=''; (document.getElementById('pwd') as HTMLInputElement).value=''; alert('Saved') }
    else alert(j.error||'err')
  }

  async function del(id:string){
    if(!confirm('Delete?')) return
    await fetch('/api/vault/delete',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id})})
    fetchVault(user.email)
  }

  function generate(){
    const opts = genOpts
    const lookalikes = ['i','l','1','L','0','O','o']
    const lowers='abcdefghijklmnopqrstuvwxyz'
    const uppers='ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const nums='0123456789'
    const syms='!@#$%^&*()_-+=[]{};:,.<>/?'
    let pool=''
    if(opts.lower) pool+=lowers
    if(opts.upper) pool+=uppers
    if(opts.numbers) pool+=nums
    if(opts.symbols) pool+=syms
    if(opts.excludeLookalikes) pool = pool.split('').filter(c=>!lookalikes.includes(c)).join('')
    if(pool.length===0) return setGenPassword('')
    let out=''
    for(let i=0;i<opts.length;i++){ out += pool[Math.floor(Math.random()*pool.length)] }
    setGenPassword(out)
    ;(document.getElementById('pwd') as HTMLInputElement).value = out
  }

  function copyAndAutoClear(text:string){
    navigator.clipboard.writeText(text)
    if(copyTimer) clearTimeout(copyTimer)
    const t = window.setTimeout(()=>{ navigator.clipboard.writeText(''); setCopyTimer(null); alert('Clipboard cleared') },15000)
    setCopyTimer(t)
    alert('Copied to clipboard (will clear in 15s)')
  }

  const filtered = items.filter(it=> {
    if(!search) return true
    const plain = decryptItem(it.ciphertext, it.iv||'') || {}
    const s = (plain.title||'') + ' ' + (plain.username||'') + ' ' + (plain.url||'')
    return s.toLowerCase().includes(search.toLowerCase())
  })

  return <>
    <Head>
      <title>Password Vault - Secure Password Manager</title>
      <meta name="description" content="Secure, privacy-first password manager with client-side encryption" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔐</text></svg>" />
    </Head>
    <div className='container'>
    <div className='header'>
      <h2>🔐 Password Vault (MVP)</h2>
      <div>
        {user ? <div className='row'><span className='small'>Signed in: {user.email}</span><button onClick={logout} className='btn' style={{marginLeft:8}}>Logout</button></div> :
        <div className='row'>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder='email' className='input' disabled={loading} />
          <input value={password} onChange={e=>setPassword(e.target.value)} placeholder='password' className='input' type='password' disabled={loading} />
          <button onClick={login} className='btn' disabled={loading}>{loading ? 'Loading...' : 'Login'}</button>
          <button onClick={register} className='btn' style={{marginLeft:6}} disabled={loading}>Register</button>
        </div>}
      </div>
    </div>

    <div className='card'>
      <h3>Generate password</h3>
      <div className='row' style={{marginTop:8}}>
        <label className='small'>Length: {genOpts.length}</label>
        <input type='range' min={8} max={64} value={genOpts.length} onChange={(e)=>setGenOpts({...genOpts, length: Number(e.target.value)})} />
        <button className='btn' onClick={generate}>Generate</button>
        <div style={{marginLeft:8}} className='badge'>{genPassword}</div>
      </div>
      <div style={{marginTop:8}} className='row'>
        <label><input type='checkbox' checked={genOpts.upper} onChange={e=>setGenOpts({...genOpts, upper:e.target.checked})}/> Upper</label>
        <label><input type='checkbox' checked={genOpts.lower} onChange={e=>setGenOpts({...genOpts, lower:e.target.checked})}/> Lower</label>
        <label><input type='checkbox' checked={genOpts.numbers} onChange={e=>setGenOpts({...genOpts, numbers:e.target.checked})}/> Numbers</label>
        <label><input type='checkbox' checked={genOpts.symbols} onChange={e=>setGenOpts({...genOpts, symbols:e.target.checked})}/> Symbols</label>
        <label style={{marginLeft:10}}><input type='checkbox' checked={genOpts.excludeLookalikes} onChange={e=>setGenOpts({...genOpts, excludeLookalikes:e.target.checked})}/> Exclude look-alikes</label>
      </div>
    </div>

    <div className='card'>
      <h3>Save new item</h3>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
        <input id='title' placeholder='Title' className='input' />
        <input id='username' placeholder='Username' className='input' />
        <input id='pwd' placeholder='Password' className='input' />
        <input id='url' placeholder='URL' className='input' />
      </div>
      <div style={{marginTop:8}}>
        <textarea id='notes' placeholder='notes' className='textarea' />
      </div>
      <div style={{marginTop:8}}>
        <button onClick={saveItem} className='btn'>Save to vault</button>
      </div>
    </div>

    <div className='card'>
      <h3>My vault</h3>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div className='small'>Items: {items.length}</div>
        <div>
          <input placeholder='search...' value={search} onChange={e=>setSearch(e.target.value)} className='search' />
        </div>
      </div>

      <div className='list'>
        {filtered.map(it=> {
          const plain = decryptItem(it.ciphertext, it.iv||'') || {title:'(locked)'}
          return <div key={it._id} className='item'>
            <div>
              <div style={{fontWeight:600}}>{plain.title||'untitled'}</div>
              <div className='small'>{plain.username} {plain.url && '• '+plain.url}</div>
            </div>
            <div className='actions'>
              <button className='btn' onClick={()=>copyAndAutoClear(plain.password)}>Copy</button>
              <button className='btn' onClick={()=>{ const newName = prompt('Edit title', plain.title||''); if(newName){ const newPlain = {...plain, title:newName}; const enc = encryptItem(newPlain); fetch('/api/vault/update',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:it._id, ...enc})}).then(()=>fetchVault(user.email)) }}}>Edit</button>
              <button className='btn' onClick={()=>del(it._id)}>Delete</button>
            </div>
          </div>
        })}
      </div>
    </div>
    </div>
  </>
}
