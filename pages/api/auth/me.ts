import type { NextApiRequest, NextApiResponse } from 'next'
import { parse } from 'cookie'
import clientPromise from '../../../lib/mongo'
export default async function handler(req:NextApiRequest,res:NextApiResponse){
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {}
  if(!cookies.session) return res.json({})
  try{
    const session = JSON.parse(cookies.session)
    const client = await clientPromise
    const db = client.db()
    const user = await db.collection('users').findOne({ email: session.email })
    if(!user) return res.json({})
    return res.json({ email: user.email, kdfSalt: user.kdfSalt })
  }catch(e){
    return res.json({})
  }
}
