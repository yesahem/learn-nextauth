import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();
    console.log(
      "username" + username + "\n" + "email" + email,
      "\n" + "password" + password,
    );
    const existingVerifiedUser = await prisma.user.findFirst({
      where: {
        username,
        isVerified: true,
      },
    });
    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username already exists",
        },
        { status: 400 },
      );
    }

    const exisitngUserByEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated Otp", otp);
    if (exisitngUserByEmail) {
      if (exisitngUserByEmail.isVerified) {
        return Response.json({
          success: false,
          message: "user already exists",
        });
      } else {
        const hashedPassword = await bcrypt.hash(password, 12);

        const updateUserByExistingEmail = await prisma.user.update({
          where: {
            email,
          },
          data: {
            otp,
            otpExpiry: new Date(Date.now() + 3600),
            password: hashedPassword,
          },
        });

        console.log("user Updates sucesssfully", updateUserByExistingEmail);
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 12);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const insertNewUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          otp,
          otpExpiry: expiryDate,
          isAcceptingMessages: true,
          isVerified: false,
        },
      });
      console.log("userInserted sucesssfully", insertNewUser);

      const sendVerificationMail = await sendVerificationEmail(
        email,
        username,
        otp,
      );

      console.log("verification email confirmation", sendVerificationMail);
      if (!sendVerificationMail.sucess) {
        return Response.json(
          {
            success: false,
            message: "Error OTP cant be send ",
          },
          { status: 550 },
        );
      }
      return Response.json(
        {
          success: true,
          message: "OTP sent",
        },
        { status: 203 },
      );
    }
  } catch (error) {
    console.error("Error registering the user", error);
    return Response.json(
      {
        success: false,
        message: "error registering the user",
      },
      { status: 500 },
    );
  }
}
