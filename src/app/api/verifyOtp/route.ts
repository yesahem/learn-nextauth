import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { username, otp } = await req.json();

  try {
    const otpVerification = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (
      otpVerification?.otp === otp &&
      otpVerification?.otpExpiry! > new Date()
    ) {
      const verificationUpdate = await prisma.user.update({
        where: {
          username,
        },
        data: {
          isVerified: true,
        },
      });
      if (verificationUpdate) {
        return Response.json({
          success: true,
          message: "User verification Successfull",
        });
      } else {
        return Response.json({
          success: false,
          message: "Coudn't verify user ",
        });
      }
    } else {
      return Response.json(
        {
          success: false,
          message: "Otp Expired",
        },
        { status: 400 },
      );
    }
  } catch (err) {
    console.log("error occured during otp verification", err);
    return Response.json(
      {
        success: false,
        message: "something went wrong at our end ",
      },
      { status: 500 },
    );
  }
}
