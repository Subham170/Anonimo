import {z} from 'zod';

export const usernameValidation = z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(20, { message: 'Username must be at most 30 characters long' })
    .regex(/^[a-z0-9]+$/, { message: 'Username can only contain lowercase letters and numbers' });

export const signUpSchema = z.object({
      username: usernameValidation ,
      email : z.string().email({message:'Invalid email address'}),
      password : z.string().min(6, { message: 'Password must be at least 6 characters long' })
  })  