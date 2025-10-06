import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../lib/mongo'
import { parse } from 'cookie'
export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method!=='POST') return res.status(405).end()
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {}
  if(!cookies.session) return res.status(401).json({ error:'no_auth' })
  const session = JSON.parse(cookies.session)
  const { ciphertext, iv } = req.body
  if(!ciphertext) return res.status(400).json({ error:'missing' })
  const client = await clientPromise
  const db = client.db()
  const id = (await db.collection('vault').insertOne({ owner: session.email, ciphertext, iv, createdAt: new Date() })).insertedId
  res.json({ ok:true, id })
}
