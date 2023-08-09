import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express'
import { createApolloServer } from './graphql';
import JWTService from './services/jwt';
import path from "path";
import FileHandleService from './services/fileHandle';
import UserService from './services/users';
import { prismaClient } from './clients/db';
const router = express.Router()

const app = express()
const PORT = process.env.PORT || 4000
app.use(express.static(path.join(__dirname, '..', 'public')))

app.use(express.json())

const uploads = FileHandleService.MulterStorage()


/**
 * User Profile Image update
 */
const fileUpload = router.post('/profileImage', uploads.single("profileImage"), async (req, res) => {

    const userPayload = {
        //@ts-ignore
        "id": req.user.id,
        //@ts-ignore
        "firstName": req.user.firstName,
        //@ts-ignore 
        "lastName": req.user.lastName,
        "profileImageUrl": `public/profileImage/${req.file?.filename}`
    }
    //@ts-ignore 
    //console.log(req.file)
    await UserService.updateUser(userPayload)
    res.send("Calling api....")
})

app.use('/upload', auth, fileUpload)

app.use('/posts', async (req, res) => {
    const url = await FileHandleService.getPostFromS3({
        filname: `pxfuel-1691344031270.jpg`,
        userId: "3835b385-95d7-43b5-b6cc-ecc678aef596",
    })
    console.log(url)
    res.send('hii')
})

function auth(req: express.Request, res: express.Response, next: express.NextFunction) {
    const token = req.headers['authorization']
    const userInfo = JWTService.decodeToken(token as string)
    if (userInfo) {
        //@ts-ignore
        req.user = userInfo
        next()
    } else {
        return res.status(403).send("unauthorized")
    }
}

async function init() {
    app.use('/graphql', expressMiddleware(await createApolloServer(), {
        context: async function ({ req }) {
            try {
                //@ts-ignore
                const token = req.headers['authorization']
                const userInfo = JWTService.decodeToken(token as string)
                return { user: userInfo }
            } catch (e) {
                return { user: null }
            }
        }
    }))

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

init()
