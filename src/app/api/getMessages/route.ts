import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  const username = user?.username;
  if (!session) {
    return Response.json({
      success: false,
      message: "User not loggedin",
    });
  }
  try {
    const getMessages = await prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        messages: true,
      },
    });
    if (!getMessages) {
      return Response.json({
        success: false,
        message: "cant find user with thee given username ",
      });
    } else {
      return Response.json({
        succcess: true,
        message: getMessages.messages,
      });
    }
  } catch (err) {
    console.log("wrong at our end ", err);
    return Response.json({
      success: false,
      message: "Something went wrong at our end",
    });
  }
}
