import { prismaClient } from "../clients/db";
import { CreatePostPayload } from "../interfaces";

class PostService {
    
  public static getAllPosts(){
    return prismaClient.post.findMany({
        include : {
            author : true
        }
    })
  }

  public static createPost(payload: CreatePostPayload, userId: string){
    const { content, imageUrl } = payload
    const post = prismaClient.post.create({
        data : {
          content,
          imageUrl,
          authorId : userId
        }
    })
    return post
  }
}

export default PostService