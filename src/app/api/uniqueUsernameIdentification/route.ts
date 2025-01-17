// this is a route to check for the unique user identificaion (does the user with the given username already exists or not)

import { prisma } from "@/lib/prisma";
import { userNameValidate } from "@/schema/signUpSchema";
import { z } from "zod";

const usernameQuerySchema = z.object({
  username: userNameValidate,
});

export async function GET(req: Request) {
  try {
    //getting username query from url

    const { searchParams } = new URL(req.url);
    const queryParams = {
      username: searchParams.get("username"),
    };
    const parsingResult = usernameQuerySchema.safeParse(queryParams);
    console.log("parsingResult= ", parsingResult);
    if (!parsingResult.success) {
      const usernameError =
        parsingResult.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameError.length > 0
              ? usernameError.join(", ")
              : "Invalid username format",
        },
        { status: 405 },
      );
    }
    const { username } = parsingResult.data;

    const doesUsernameAlreadyTaken = await prisma.user.findUnique({
      where: {
        username,
        isVerified: true,
      },
    });

    if (doesUsernameAlreadyTaken) {
      return Response.json(
        {
          success: false,
          message: "Username already taken",
        },
        { status: 405 },
      );
    } else {
      return Response.json(
        {
          success: true,
          message: "Username is available",
        },
        { status: 201 },
      );
    }
  } catch (error) {
    console.error("something went wrong while validating UserName", error);
    return Response.json(
      {
        success: false,
        message: "Error Validating username",
        error: error,
      },
      { status: 403 },
    );
  }
}
