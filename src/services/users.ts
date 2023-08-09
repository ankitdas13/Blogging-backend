import crypto from "crypto"
import { prismaClient } from "../clients/db";
import { CreateUserPayload, UpdateUserPayload } from "../interfaces";

class UserService {
    
    public static generateHash(salt:string, payload:string){
       return  crypto.createHmac("sha256",salt).update(payload).digest("hex")
    }

    public static fetchAllUsers(){
        const users = prismaClient.user.findMany({})
        return users
    }

    public static fetchUser(email:string){
      const user = prismaClient.user.findUnique({
        where: {
          email
        }
      })
      return user
    }
    
    public static createUser(payload : CreateUserPayload){
        const {firstName, lastName, email, password} = payload
        const salt = crypto.randomBytes(32).toString('hex')
        const hashedPassword = UserService.generateHash(salt, password)
        const user =  prismaClient.user.create({
            data : {
              firstName,
              lastName,
              email,
              password: hashedPassword,
              salt
            }
        })

        return user
    }

    public static updateUser(payload : UpdateUserPayload){
      const { firstName, lastName, profileImageUrl } = payload
      /**@ts-ignore**/
      const InsertData = { firstName, lastName, profileImageUrl }
      
      if(payload.password){
        const salt = crypto.randomBytes(32).toString('hex')
        const hashedPassword = UserService.generateHash(salt, payload.password)     
        /**@ts-ignore**/
        InsertData.password = hashedPassword
        /**@ts-ignore**/
        InsertData.salt = salt
      }
      
      const user = prismaClient.user.update({
        where : {
          id : payload.id
        },
        data : InsertData
      })

      return user
    }
}

export default UserService