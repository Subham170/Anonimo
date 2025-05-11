import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text", placeholder: "email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "password",
        },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          console.log("user", user);
          if (!user) {
            throw new Error("User not found");
          }
          if (!user.isVerified) {
            console.log("User is not verified");
            throw new Error("User is not verified");
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordCorrect) {
            throw new Error("Password is incorrect");
          } else {
            return user;
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
        session.user.username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: "new-to-next",
};
