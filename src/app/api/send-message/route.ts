import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(req : Request){
    await dbConnect();
    try{
       const {username, content} = await req.json();
       const user = await UserModel.findOne({username}); 
       if(!user){
            return Response.json({
                success : false,
                message: "User not found"
            },
            {
                status: 404
            })
       }

       //is user accepting messages
       if(!user.isAcceptingMessage){
            return Response.json({
                success : false,
                message: "User is not accepting messages"
            },
            {
                status: 403
            })
       }

       const newMessage ={content, createdAt : new Date()}; 
       user.messages.push(newMessage as Message); 
       await user.save();

       return Response.json({success : true, message : "Message sent"}, {status : 200});
       
    } catch(error){
        console.log("Error adding messages",error)
        return Response.json({success : false, message : "Internal Server Error"}, {status : 500});
    }
}