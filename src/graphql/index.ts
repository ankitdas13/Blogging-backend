import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express'
import http from 'http';
import {User} from "./users"
import {Post} from "./posts"

const app = express()
const httpServer = http.createServer(app)

export async function createApolloServer(){
    const gqlServer = new ApolloServer({
        typeDefs : `
         ${User.typeDefs}
         ${Post.typeDef}

         type Query {
            ${User.queries}
            ${Post.queries}
         }

         type Mutation {
            ${User.mutations}
            ${Post.mutations}
         }
        `,
        resolvers : {
            Query: {
               ...User.resolvers.queries,
               ...Post.resolvers.queries
            },
                        
            Mutation : {
                ...User.resolvers.mutations,
                ...Post.resolvers.mutations
            }
        },
        plugins : [
            ApolloServerPluginDrainHttpServer({ httpServer}) 
        ]
    })

    await gqlServer.start()

    return gqlServer
}