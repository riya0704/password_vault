import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../lib/mongo'
import { parse } from 'cookie'
export default async function handler(req:NextApiRequest,res:NextApiResponse){
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {}
  if(!cookies.session) return res.status(401).json({ error:'no_auth' })
  const session = JSON.parse(cookies.session)
  const client = await clientPromise
  const db = client.db()
  const items = await db.collection('vault').find({ owner: session.email }).sort({ createdAt:-1 }).toArray()
  res.json({ items: items.map(it=>({ _id: it._id.toString(), ciphertext: it.ciphertext, iv: it.iv })) })
}
