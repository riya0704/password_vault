import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../lib/mongo'
import { parse } from 'cookie'
import { ObjectId } from 'mongodb'
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {}
  if (!cookies.session) return res.status(401).json({ error: 'no_auth' })
  const session = JSON.parse(cookies.session)
  const { id } = req.body
  const client = await clientPromise
  const db = client.db()
  await db.collection('vault').deleteOne({ _id: new ObjectId(id), owner: session.email })
  res.json({ ok: true })
}
