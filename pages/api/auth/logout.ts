import type { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'cookie'
export default async function handler(req,res){
  res.setHeader('Set-Cookie', serialize('session','', { path:'/', httpOnly:true, maxAge: -1 }))
  res.json({ ok:true })
}
