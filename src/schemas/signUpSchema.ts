import {z} from "zod"

export const usernameValidation = z
   .string()
   .min(2, "Username must be 2 character")
   .max(20, "Username no more than 20 character")

   export const signUpSchema = z.object({
    username : usernameValidation,
    email : z.string().email({message: "Invalid email address"}),
    password : z.string().min(6,{ message: "Password must be in 6 character"})
   })