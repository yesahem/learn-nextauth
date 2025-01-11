import { resend } from "@/lib/resendEmail";

import VerificationEmail from "../../emails/VerificationEmail";

import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verificationCode: string,
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "ahemraj82@gmail.com",
      subject: "Hello world",
      react: VerificationEmail({ username, otp: verificationCode }),
    });

    return {
      sucess: true,
      message: "Email sent sucessfully",
    };
  } catch (err) {
    console.error("Errror sending  email verification", err);
    return {
      sucess: false,
      message: "Error sending email verification",
    };
  }
}

