import axios from "axios"
import { prismaClient } from "../../clients/db"
import { CreateUserPayload, UpdateUserPayload } from "../../interfaces"
import JWTService from "../../services/jwt"
import UserService from "../../services/users"
import { User } from "@prisma/client"

const queries = {
  getAllUser: async () => {
    const users = await UserService.fetchAllUsers()
    return users
  },

  getUserToken: async (_: any, { email, password }: { email: string, password: string }) => {
    const user = await UserService.fetchUser(email)
    if (!user) {
      throw new Error("email or password is incorrect")
    }

    const hashedPassword = UserService.generateHash(user.salt, password)

    if (hashedPassword !== user.password) {
      throw new Error("Password is incorrect")
    }
    const token = JWTService.generateToken(user as User)
    return token
  },

  getCurrentUser: async (_: any, { }, ctx: any) => {
    if (!ctx.user) {
      throw new Error("unauthorised")
    }
    const user = await UserService.fetchUser(ctx.user.email)
    return user
  }
}

const mutations = {
  createUser: async (_: any, { payload }: { payload: CreateUserPayload }) => {
    const user = await UserService.createUser(payload)
    if (user) {
      return `${payload.email} is created`
    }
  },
  UpdateUserProfile: async (_: any, { payload }: { payload: UpdateUserPayload }, ctx:any) => {
    console.log(payload, ctx)
    const user = await UserService.updateUser(payload)
    if (user) {
      return `Profile is successfully updated`
    }
  }
}

export const resolvers = { queries, mutations }
