import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    isVerified?: boolean;
    username?: string;
    isAcceptingMessages?: boolean;
    email?: string;
  }

  interface Session {
    user: {
      id?: string;
      idVerified?: boolean;
      username?: string;
      isAcceptingMessages?: boolean;
      email?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    isVerified?: boolean;
    username?: string;
    isAcceptingMessages?: boolean;
    email?: string;
  }
}
