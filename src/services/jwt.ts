import JWT from "jsonwebtoken"
import { User } from "@prisma/client"

const secret = "twitter@123"

class JWTService {
    
    public static generateToken(user: User){        
        const token = JWT.sign({
            "id": user.id,
            "email": user.email,
            "firstName": user.firstName,
            "lastName" : user.lastName
          }, secret, {
            expiresIn: "5m"
         })       
         return token
    }

    public static decodeToken(token: string){
        try{
            return JWT.verify(token, secret)
        }catch(e){
            return null
        }
    }
}

export default JWTService