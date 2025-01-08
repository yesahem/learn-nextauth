import {z} from 'zod';

export const signUpSchema = z.object({
    email: z.string().email({message: "please input a valid email"}),
    password: z.string().min(6,{message: "please enter minimum 6 character"}),
    firstName: z.string(),
    username: z.string(),
})


export const userNameValidate = z.string().min(3,{message: "username oo short please enter  minimun 4 3 characters"}).max(15,{message: "please enter the username less than 20 character"}).regex(/^[a-zA-Z0-9_]+$/,"username must not contain special characters")