import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "youremail@example.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials: any): Promise<any> {
        try {
          const user = await prisma.user.findFirst({
            where: {
              email: credentials.email,
            },
          });
          console.log("i am user from [...nextauth]/options file", user);
          if (!user) {
            throw new Error("Can't find user with the  provided credentials");
          }
          if (!credentials) {
            throw new Error("please fill all the fields");
          }
          const comparedHashedPassword = await bcrypt.compare(
            credentials.password,
            user.password,
          );
          if (!comparedHashedPassword) {
            throw new Error("Please enter a correct password");
          }
          if (comparedHashedPassword) {
            return user;
          }
        } catch (err) {
          throw new Error(err as string);
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      console.log(token);
      if (token) {
        session.user.id = token.id;
        session.user.idVerified = token.isVerified;
        session.user.username = token.username;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
      }
      return session;
    },
    async jwt({ token, user }) {
      console.log(user);
      // user comes here from the above  fields where we have returned the user
      if (user) {
        token.id = user.id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }

      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
