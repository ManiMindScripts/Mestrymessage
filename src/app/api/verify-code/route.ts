import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";


export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username, code } = await request.json()
        const decodedUser = decodeURIComponent(username)
        const user = await UserModel.findOne({ username: decodedUser })

        if(!user){
             return Response.json({
            success: false,
            message: "User not found"
        }, { status: 400 }
        )}

        const isValidCode = user.verifyCode === code
        const isCodeNotExpire = new Date(user.verifyCodeExpiry) > new Date ()
        if(isValidCode && isCodeNotExpire) {
        user.isVerified = true
        await user.save()
        return Response.json({
            success: true,
            message: "User Verified"
        }, { status: 200 }
        )} else if (!isCodeNotExpire){
            return Response.json({
            success: false,
            message: "Code has been expired"
        }, { status: 400 }) 
        } else 
{
    return Response.json({
            success: false,
            message: "Code is incorrect"
        }, { status: 400 })
}
    } catch (error) {
        console.error("Error Verify User", error)
        return Response.json({
            success: false,
            message: "Error Verify User"
        }, { status: 500 }
        )
    }
}