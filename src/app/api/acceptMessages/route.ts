import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return Response.json(
      {
        success: false,
        message: "User not authenticated",
      },
      { status: 403 },
    );
  }
  const username = user?.username;
  const { acceptMessages } = await req.json();
  try {
    const updateUserChoiseToAcceptMessages = await prisma.user.update({
      where: {
        username,
      },
      data: {
        isAcceptingMessages: acceptMessages,
      },
    });

    if (!updateUserChoiseToAcceptMessages) {
      return Response.json({
        success: false,
        message: "Failed to toggle user choise to accept messages",
      });
    } else {
      return Response.json({
        success: true,
        message: "updated toggle user choise to accept messages",
      });
    }
  } catch (err) {
    console.log("message toggle error", err);
    return Response.json({
      success: false,
      message: "Something went wrong while toggle messages choises",
    });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user) {
    return Response.json({
      success: false,
      message: "User is not loggedinn...",
    });
  }

  const username = user.username;
  try {
    const userAcceptingMessages = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (userAcceptingMessages) {
      return Response.json(
        {
          success: true,
          userAcceptingMessages: userAcceptingMessages.isAcceptingMessages,
        },
        { status: 200 },
      );
    }
    return Response.json({
      success: false,
      message: "User with the usernamenot found",
    });
  } catch (err) {
    console.log("error ", err);
    return Response.json(
      {
        success: false,
        message: "Something went wrong during db search ",
      },
      { status: 500 },
    );
  }
}
