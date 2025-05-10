import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { verifySchema } from "@/schemas/verifySchema";

export async function POST(req : Request) {
    // const body = await req.json();
    // const { code } = verifySchema.parse(body);
    // await dbConnect();
    // const user = await UserModel.findOne({ verifyCode: code });
    // if (!user) {
    //     return Response.json({ success: false, message: "Invalid code" }, { status: 400 });
    // }
    // user.isVerified = true;
    // await user.save();
    // return Response.json({ success: true, message: "Email verified" }, { status: 200 });
    await dbConnect();
    try{
      const {username, code} = await req.json();
      const decodedUsername = decodeURIComponent(username);
      const user = await UserModel.findOne({username :decodedUsername});
      
      if(!user){
        return Response.json({
            success: false,
            message: "User not found",
        },
        {
            status: 404
        })
      }

      const isCodeValid = user.verifyCode === code;
      const isCodeNotExpired = new Date(user.verifyCodeExpireAt) > new Date();

      if(isCodeValid && isCodeNotExpired){
        user.isVerified = true;
        await user.save();
        return Response.json({
            success: true,
            message: "Account verified successfully",
        },
        {
            status: 200
        })
      }
      else if(!isCodeValid){
        return Response.json({
            success: false,
            message: "Incorrect Verification Code",
        },
        {
            status: 400
        })
      }
      else{
        return Response.json(
        {
            success: false,
            message: "Verification Code has expired, please signup again to get new code",
        },        
        {
            status: 400
        }
        )
      }

    } catch(error){
        console.log("Error verifying user",error);
        return Response.json({
            success: false,
            message: "Something went wrong",
        },
        {
            status: 500
        })
    }
}