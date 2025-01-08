import {z} from "zod";


export const otpValidation = z.object({
    otp: z.string().length(6,{message: "Code must be of 6 digits"})
})