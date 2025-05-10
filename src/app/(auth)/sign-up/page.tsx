'use client';

import {use, useEffect, useState} from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link";
import {useDebounceCallback, useDebounceValue } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchmea";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
const page = ()=>{
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 300);
  const router = useRouter();

  //zod implementation
  const form  = useForm({
    resolver : zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email : "",
      password : ""
    }
  })

  useEffect(() => {
  const checkUsernameUnique = async () => {
    if(username){
      setIsCheckingUsername(true);
      setUsernameMessage("");
      try {
        const response = await axios.get(`/api/check-username-unique?username=${username}`);
        let message = response.data.message;
        setUsernameMessage(message);
        
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        
          setUsernameMessage(axiosError.response?.data.message ?? "Error checking username");
        
          toast.error("Something went wrong");
        
        
      } finally{
        setIsCheckingUsername(false);
      }
    }
  }

  checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data : z.infer<typeof signUpSchema>) => {
    setSubmitting(true);
    try {
      const response = await axios.post("/api/sign-up", data);
      toast.success(response.data.message);
      router.replace(`/verify/${username}`);
    } catch (error) {
      console.error("Error in signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message || "An unexpected error occurred";
    
      toast.error("Signup failed", {
        description: errorMessage,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return(
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome to Anonimo
          </h1>
          <p className="mb-4">Sign up to start your anonymous conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input placeholder="Enter your username" {...field} onChange={(e)=> {
                    field.onChange(e);
                    debounced(e.target.value);
                  }}  />
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  {/* {!isCheckingUsername && usernameMessage && ( */}
                    
                    <p
                    
                      className={`text-sm ${
                        usernameMessage.trim() === "Username is available"
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input placeholder="Enter your email" {...field} name="email" />
                  <p className=' text-gray-400 text-sm'>We will send you a verification code</p>
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
                  <Input placeholder="Enter your password" type="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='w-full' type="submit" disabled={isSubmitting}>
              {
                 isSubmitting? (
                  <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
                  </>
                 ) :("Sign Up")
              }
              </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page