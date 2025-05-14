import { getServerSession } from "next-auth";
import {authOptions} from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request : Request){
    await dbConnect();
    const session = await getServerSession(authOptions); 

    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }
   
    const user : User = session?.user  as User;
    console.log("user munna", user);

    if (!user) {
        return new Response("User not found", { status: 404 });
    }
    const userId = new mongoose.Types.ObjectId(user._id);

    console.log("userId", userId);

    try{
       const user = await UserModel.aggregate([
        {$match: { _id: userId }},
        {$unwind : "$messages"},
        {$sort : {"messages.createdAt" : -1}},
        {$group : {_id : "$_id", messages : {$push : "$messages"}}}
       ]).exec();
       console.log("user", user);
       if(!user || user.length === 0){
            return Response.json(
                {
                    success : false,
                    message: "User not found undefined"
                },
                {
                    status: 404
                }
            )
       }

       return Response.json(
        {
            success : true,
            messages : user[0].messages
        },
        {
            status: 200
        }
    )

    } catch(error){
      console.log("error", error);
    }
                                                                         
}