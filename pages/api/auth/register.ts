import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../lib/mongo'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'
export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method!=='POST') return res.status(405).end()
  const { email, password } = req.body
  if(!email || !password) return res.status(400).json({ error:'missing' })
  const client = await clientPromise
  const db = client.db()
  const existing = await db.collection('users').findOne({ email })
  if(existing) return res.status(400).json({ error:'exists' })
  const saltRounds = 10
  const hashed = bcrypt.hashSync(password, saltRounds)
  // store a kdfSalt for client-side PBKDF2 (hex)
  const kdfSalt = randomBytes(16).toString('hex')
  await db.collection('users').insertOne({ email, password: hashed, kdfSalt, createdAt: new Date() })
  return res.json({ ok:true })
}
