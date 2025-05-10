import { getServerSession } from "next-auth";
import {authOptions} from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User } from "next-auth";
import mongoose from "mongoose";

export async function DELETE(request : Request , {params} : {params : {messageid : string}}){
    const messageId = params.messageid;
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }
   
    const user : User = session?.user  as User;
    if (!user) {
        return new Response("User not found", { status: 404 });
    }
    const userId = new mongoose.Types.ObjectId(user._id);

    try{
       const updateResult = await UserModel.updateOne(
        {_id :user._id},
        {$pull : {messages  : {_id : messageId}}}
       )
       
       
       if(updateResult.modifiedCount === 0){
            return Response.json(
                {
                    success : false,
                    message: "Message not found or already deleted"
                },
                {
                    status: 404
                }
            )
       }

       return Response.json(
        {
            success : true,
            messages : "Message deleted"
        },
        {
            status: 200
        }
    )

    } catch(error){
      console.error("Error occured in delete message route", error);
      return Response.json(
        {
            success : false,
            message: "Something went wrong"
        },
        {
            status: 500
        }
    )
    }
                                                                         
}