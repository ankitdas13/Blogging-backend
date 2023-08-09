import { prismaClient } from "../../clients/db"
import PostService from "../../services/posts"
import { redisClient } from "../../clients/redis"

const queries = {
    getAllPosts: async () => {
      const cachedPost = await redisClient.get("ALL_POST")

      if(cachedPost) return JSON.parse(cachedPost)

      const posts =  await PostService.getAllPosts()
      await redisClient.set("ALL_POSTS",JSON.stringify(posts))
      return posts
    }
}

const mutations = {
    //@ts-ignore
    addPost: async (_:any,{payload}:{payload : any},ctx) => {
       if(!ctx.user){
         throw new Error("unauthorised")
       }
       
       const ratelimitFlag= await redisClient.get(`RATE_LIMIT:${ctx.user.id}`)

       if(ratelimitFlag){
        throw new Error("Please wait...")
       }

       const post = await PostService.createPost(payload, ctx.user.id)
       if(post.id){
         await redisClient.setex(`RATE_LIMIT:${ctx.user.id}`,10,1);
         await redisClient.del("ALL_POST")
         return `Post published..`
       }
    }
}

export const resolvers = { queries, mutations }