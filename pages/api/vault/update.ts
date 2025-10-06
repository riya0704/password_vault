import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../lib/mongo'
import { parse } from 'cookie'
import { ObjectId } from 'mongodb'

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method!=='POST') return res.status(405).end()
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {}
  if(!cookies.session) return res.status(401).json({ error:'no_auth' })
  
  try {
    const session = JSON.parse(cookies.session)
    const { id, ciphertext, iv } = req.body
    
    if(!id || !ciphertext) return res.status(400).json({ error:'missing_data' })
    
    const client = await clientPromise
    const db = client.db()
    await db.collection('vault').updateOne(
      { _id: new ObjectId(id), owner: session.email }, 
      { $set: { ciphertext, iv, updatedAt: new Date() } }
    )
    res.json({ ok:true })
  } catch(error) {
    res.status(500).json({ error: 'server_error' })
  }
}
