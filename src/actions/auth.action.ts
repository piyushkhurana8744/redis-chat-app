"use server"

import { redis } from "@/db/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

export const CheckAuthStatus = async() => {
    const {getUser} = getKindeServerSession()

    const user = await  getUser()

    if(!user){
        return {
           success: false
        }
    }

    const userId = `user:${user.id}`

    const exisitingUser = await redis.hgetall(userId)

    if(!exisitingUser || Object.keys(exisitingUser).length === 0){
        const imgnull = user.picture?.includes("gravatar")
        const image = imgnull ? "" : user.picture
       await redis.hset(userId, {
              id: user.id,
              email: user.email,
              name: `${user.given_name} ${user.family_name}`,
              image: image,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
       })
    }
    return { success: true}
}