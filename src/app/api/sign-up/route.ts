import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bycrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(req: Request) {
    await dbConnect();

    try{
          const {username, email, password} = await req.json();
           const existingUserVerifiedByUsername = await UserModel.findOne({username, isVerified : true});

           if(existingUserVerifiedByUsername){
            return Response.json({
                success:false,
                message : "Username already exists"
            },
            {
               status : 400
            })
           }

           const existingUserVerifiedByEmail = await UserModel.findOne({email});
              
           const verifyCode = Math.floor(100000 + Math.random()*900000).toString()

           if(existingUserVerifiedByEmail){
              if(existingUserVerifiedByEmail.isVerified){
                return Response.json({
                    success:false,
                    message : "Email already exists"
                },
                {
                   status : 400
                })
              } else{
                 const hashedPassword = await bycrypt.hash(password, 10);
                 existingUserVerifiedByEmail.password = hashedPassword;
                 existingUserVerifiedByEmail.verifyCode = verifyCode;
                 existingUserVerifiedByEmail.verifyCodeExpireAt = new Date(Date.now() + 3600000);
                 await existingUserVerifiedByEmail.save();
              }

           } else{
            const hashedPassword = await bycrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 1);

            const newUser = new UserModel({
                username,
                email,
                password : hashedPassword,
                verifyCode ,
                verifyCodeExpireAt : expiryDate,
                isVerified : false,
                isAcceptingMessage:true,
                messages : []
            }); 
            console.log("newUser",newUser)
            await newUser.save();
           }

           //send verification email
           const emailResponse = await sendVerificationEmail(email, username, verifyCode);
           console.log("emailResponse",emailResponse);

           if(!emailResponse.success){
            return Response.json({
                success:false,
                message : emailResponse.message
            },
            {
               status : 500
            }) 
           }

           return Response.json({
            success:true,
            message : "User registered successfully, please verify your email"
           },
           {
            status : 201
           })
        
    } catch(error){
        console.error("Error registering user", error);
        return Response.json({
            success:false,
            message : "Failed to register user"
        },
    {
        status : 500
    })
    }
}