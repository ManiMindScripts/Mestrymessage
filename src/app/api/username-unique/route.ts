import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import {  z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    await dbConnect()
    console.log("Db connect is username")

    try {
        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username') ?? ''
        }
        const res = UsernameQuerySchema.safeParse(queryParam)
        console.log(res)
        if (!res.success) {
            const usernameError = res.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: "Invalid Parameter"
            }, { status: 400 })
        }

        const { username  } = res.data
        const existingUser = await UserModel.findOne({ username, isVerified: true })
        if (existingUser) {
            return Response.json({
                success: false,
                message: "Username is not available"
            }, { status: 400 })
        }
        return Response.json({
            success: true,
            message: "Username is unique"
        }, { status: 200 })
    } catch (error) {
        console.error("Error Finding username", error)
        return Response.json({
            success: false,
            message: "Error finding username"
        }, { status: 500 }
        )
    }
}