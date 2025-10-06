import { MongoClient } from 'mongodb'
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/passwordvault"
let client: MongoClient
let clientPromise: Promise<MongoClient>
if (!globalThis._mongoClientPromise) {
  client = new MongoClient(uri)
  globalThis._mongoClientPromise = client.connect()
}
clientPromise = globalThis._mongoClientPromise
export default clientPromise
