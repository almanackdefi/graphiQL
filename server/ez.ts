import { CreateApp } from '@graphql-ez/vercel'
import { ezSchema, gql } from '@graphql-ez/plugin-schema'
import fb from './firebase-plugin'
import admin from 'firebase-admin'

export const ezApp = CreateApp({
  cors: true,
  ez: {
    plugins: [
      ezSchema({
        schema: {
          typeDefs: gql`
            type Query {
              hello: String!
            }
          `,
          resolvers: {
            Query: {
              hello() {
                return 'Hello World!'
              },
            },
          },
        },
      }),
    ],
  },
  envelop: {
    plugins: [
      fb({
        firebaseApp: admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY,
          }),
        }),
      }),
    ],
  },
})
