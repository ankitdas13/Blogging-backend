import { prismaClient } from "../../clients/db"
import PostService from "../../services/posts"

const queries = {
    getAllPosts: async () => {
      const posts =  await PostService.getAllPosts()
      //console.log(posts)
      return posts
    }
}

const mutations = {
    //@ts-ignore
    addPost: async (_:any,{payload}:{payload : any},ctx) => {
       if(!ctx.user){
         throw new Error("unauthorised")
       }

       const post = await PostService.createPost(payload, ctx.user.id)
       if(post.id){
         return `Post published..`
       }
    }
}

export const resolvers = { queries, mutations }