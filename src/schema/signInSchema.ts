import {z} from "zod";


export const SignInSchem = z.object({
    email: z.string().email(),
    password: z.string().min(6, {message: "please enter password of min 6 digits"}),
    
})