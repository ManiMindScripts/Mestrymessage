import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";


export async function DELETE(request: Request, { params }: { params: { messageid: string } }) {
    const messageId = params.messageid
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user
    if (!session || session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }
    try {
        const updateRes = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageId } } }
        )
        if (updateRes.modifiedCount == 0) {
            return Response.json(
                {
                    success: false,
                    message: "Message not founded"
                },
                { status: 404 }
            )
        }
         return Response.json(
                {
                    success: true,
                    message: "Message deleted"
                },
                { status: 200 }
            )
    } catch (error) {
return Response.json(
                {
                    success: false,
                    message: "Error deleting Message"
                },
                { status: 500 }
            )
    }
}