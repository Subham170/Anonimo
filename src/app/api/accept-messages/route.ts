import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(req : Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }
   
    const user : User = session?.user  as User;
    if (!user) {
        return new Response("User not found", { status: 404 });
    }
    // user.messagesAccepted = true;
    // await user.save();
    // return new Response("Messages accepted", { status: 200 });
    const userId = user._id;
    const {acceptMessages} = await req.json();

    try{
       const updatedUser = await UserModel.findByIdAndUpdate(userId, {isAcceptingMessage : acceptMessages}, {new : true});
       if(!updatedUser){
            return Response.json(
                {
                    success : false,
                    message: "User not found"
                },
                {
                    status: 404
                }
            )
       }

       return Response.json(
        {
            success : true,
            message: "User status updated successfully",
            updatedUser
        },
        {
            status: 200
        }
    )

    } catch(error){
        console.log("failed tp update the status of the user to accept messages",error);
        return Response.json(
            {
                success : false,
                message: "failed tto update the user status to accept messages"
            },
            {
                status: 500
            }
        )
    }
}

export async function GET(req : Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }
   
    const user : User = session?.user  as User;
    if (!user) {
        return new Response("User not found", { status: 404 });
    }
    // user.messagesAccepted = true;
    // await user.save();
    // return new Response("Messages accepted", { status: 200 });
    const userId = user._id;
    // const {acceptMessages} = await req.json();

    try{
        const foundUser = await UserModel.findById(userId);
        if(!foundUser){
            return Response.json(
                {
                    success : false,
                    message: "User not found"
                },
                {
                    status: 404
                }
            )
        }
    
        return Response.json(
            {
                success : true,
                isAcceptingMessage : foundUser.isAcceptingMessage,
                message: "User status updated successfully",
                foundUser
            },
            {
                status: 200
            }
        )
    } catch(error){
        console.log("failed to update the status of the user to accept messages",error);
        return Response.json(
            {
                success : false,
                message: "Error in getting the message acceptance status"
            },
            {
                status: 500
            }
        )
    }

    

    // try{
    //    const updatedUser = await UserModel.findByIdAndUpdate(userId, {isAcceptingMessage : acceptMessages}, {new : true});
    //    if(!updatedUser){
    //         return Response.json(
    //             {
    //                 success : false,
    //                 message: "User not found"
    //             },
    //             {
    //                 status: 404
    //             }
    //         )
    //    }

    //    return Response.json(
    //     {
    //         success : true,
    //         message: "User status updated successfully",
    //         updatedUser
    //     },
    //     {
    //         status: 200
    //     }
    // )

    // } catch(error){
    //     console.log("failed tp update the status of the user to accept messages",error);
    //     return Response.json(
    //         {
    //             success : false,
    //             message: "failed tto update the user status to accept messages"
    //         },
    //         {
    //             status: 500
    //         }
    //     )
    // }
}
