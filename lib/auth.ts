import { betterAuth } from "better-auth"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"

const client = new MongoClient("mongodb://localhost:27017/database")
const db = client.db("hireloopdb")

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: mongodbAdapter(db, {
    client,
  }),
  socialProviders: {
    google: {
      // [!code highlight]
      clientId: process.env.GOOGLE_CLIENT_ID as string, // [!code highlight]
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, // [!code highlight]
    }, // [!code highlight]
  },
  emailAndPassword: {
    enabled: true,
  },
  //   socialProviders: {
  //     github: {
  //       clientId: process.env.GITHUB_CLIENT_ID as string,
  //       clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
  //     },
  //   },
})
