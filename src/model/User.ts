import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document {
    content : string,
    createdAt : Date
}

const MessageSchema : Schema<Message> = new Schema({
    content : {type : String, required : true},
    createdAt : {type : Date, required : true, default : Date.now()}    
});

export interface User extends Document {
    username : string,
    email : string,
    password : string,
    verifyCode: string,
    verifyCodeExpireAt: Date,
    isVerified : boolean,
    isAcceptingMessage : boolean,
    messages : Message[]
}

const UserSchema : Schema<User> = new Schema({
    username : {type : String, required : [true, "Username is required"], trim :true},
    email : {type : String, required : [true, "Email is required"], trim :true , unique : true, match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"Please fill a valid email address"]},
    password : {type : String, required : [true, "Password is required"]},
    verifyCode : {type : String, required : [true, "Verify code is required"]},
    verifyCodeExpireAt : {type : Date, required : [true, "Verify code expire at is required"]},
    isVerified : {type : Boolean,  default : false},
    isAcceptingMessage : {type : Boolean,  default : true},
    messages : [MessageSchema]
})

const UserModel = mongoose.models.User as mongoose.Model<User>|| mongoose.model<User>("User", UserSchema);

export default UserModel