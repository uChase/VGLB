import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/db";
import bcrypt from "bcrypt";

require("dotenv").config();

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        identifier: {
          label: "Username or Email",
          type: "text",
          placeholder: "jsmith or jsmith@example.com",
        },

        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.identifier || !credentials.password) {
          return null;
        }
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { username: credentials.identifier },
              { email: credentials.identifier },
            ],
          },
        });

        if (user) {
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isValid) {
            return Promise.resolve(user);
          } else {
            return Promise.resolve(null);
          }
        } else {
          return Promise.resolve(null);
        }
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          username: token.username,
          image: token.image,
          imageVersion: token.imageVersion,
        },
      };
    },
    jwt: ({ token, user, trigger, session }) => {
      if (trigger === "update") {
        return {
          ...token,
          ...session.user,
        };
      }
      if (user) {
        return {
          ...token,
          id: user.id,
          username: user.username,
          image: user.image,
          imageVersion: user.imageVersion,
        };
      }
      return token;
    },
  },

  adapter: PrismaAdapter(prisma),
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
