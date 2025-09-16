import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerification";


export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username, email, password } = await request.json()
        const existingusername = await UserModel.findOne(
            {
                username,
                isVerified: true
            })
        if (existingusername) {
            return Response.json({
                success: false,
                message: "Username is already Register"
            }, { status: 400 })
        }

        const existinguserbyemail = await UserModel.findOne({ email })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        if (existinguserbyemail) {
            if (existinguserbyemail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "Email already exists",
                    },
                    { status: 400 }
                );
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 10)
                existinguserbyemail.password = hashedPassword,
                    existinguserbyemail.verifyCode = verifyCode,
                    existinguserbyemail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existinguserbyemail.save()
            }
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isAcceptingMessage: true,
                messages: []
            })
            await newUser.save()
        }

        const emailResponse = await sendVerificationEmail(
            username,
            email,
            verifyCode
        )
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 })
        }
        return Response.json({
            success: true,
            message: "User register Successfully,Please verify email "
        }, { status: 201 })
    } catch (error) {
        console.log("Error registering user", error)
        return Response.json(
            {
                success: false,
                message: "Error Registering user"
            },
            {
                status: 500
            }
        )
    }
}

