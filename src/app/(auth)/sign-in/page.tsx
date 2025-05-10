'use client';

import {useEffect, useState} from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link";
import {useDebounceValue} from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signinSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
const page = ()=>{
  // const [username, setUsername] = useState("");
  // const [usernameMessage, setUsernameMessage] = useState("");
  // const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  // const [isSubmitting, setSubmitting] = useState(false);

  // const [debouncedUsername] = useDebounceValue(username, 300);
  const router = useRouter();

  //zod implementation
  const form  = useForm({
    resolver : zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      
      password : ""
    }
  })

  // useEffect(() => {
  // const checkUsernameUnique = async () => {
  //   if(debouncedUsername){
  //     setIsCheckingUsername(true);
  //     setUsernameMessage("");
  //     try {
  //       const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`);
  //       setUsernameMessage(response.data.message);
        
  //     } catch (error) {
  //       const axiosError = error as AxiosError<ApiResponse>;
        
  //         setUsernameMessage(axiosError.response?.data.message ?? "Error checking username");
        
  //         toast.error("Something went wrong");
        
        
  //     } finally{
  //       setIsCheckingUsername(false);
  //     }
  //   }
  // }

  // checkUsernameUnique();
  // }, [debouncedUsername])

  const onSubmit = async (data : z.infer<typeof signInSchema>) => {
    
    const result =await signIn("credentials", {
      identifier: data.identifier,
      password: data.password,
      redirect: false,
    })
    if(result?.error){
      toast.error(result.error)
      // setSubmitting(false);
    }
    if(result?.url){
      // toast.success("Login successful")
      router.replace("/dashboard")
    }
    
  }

  return(
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to Anonimo
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <Input placeholder="email or username" {...field}  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" placeholder="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='w-full' type="submit" >
              Sign In
              </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page