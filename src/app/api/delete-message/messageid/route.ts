import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function DELETE(request: Request,{params}: {params : {messageid : string} }) {
    const messageId = params.messageid
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user : User = session?.user
    if(!session || session.user){
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 } )
    }
    try {
      const updateRes = await UserModel.updateOne(
           {_id: user._id} ,
           {$pull: {messages:{_id: messageId}}} 
        )
        if(updateRes.modifiedCount == 0) {
            return Response.json(
                {
                    
                }
            )
        }
    } catch (error) {
        
    }
}