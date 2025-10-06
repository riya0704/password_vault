import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../lib/mongo'
import bcrypt from 'bcryptjs'
import { serialize } from 'cookie'
export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method!=='POST') return res.status(405).end()
  const { email, password } = req.body
  if(!email || !password) return res.status(400).json({ error:'missing_credentials' })
  const client = await clientPromise
  const db = client.db()
  const user = await db.collection('users').findOne({ email })
  if(!user) return res.status(400).json({ error:'no_user' })
  const ok = bcrypt.compareSync(password, user.password)
  if(!ok) return res.status(400).json({ error:'invalid' })
  // set simple session cookie containing email (not secure; for MVP)
  res.setHeader('Set-Cookie', serialize('session', JSON.stringify({ email: user.email }), { path:'/', httpOnly:true, sameSite:'lax' }))
  return res.json({ ok:true, user: { email: user.email, kdfSalt: user.kdfSalt } })
}
