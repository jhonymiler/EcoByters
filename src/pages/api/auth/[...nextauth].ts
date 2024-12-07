// src/pages/api/auth/[...nextauth].ts

import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyMessage } from "viem";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Definindo a interface do usuário
interface CustomUser {
  id: string;
  name: string;
  address: string;
  isRegistered: boolean;
  companyType: string | null;
  email: string | null;
  picture: string | null;
}

declare module "next-auth" {
  interface Session {
    user: {
      address: string;
      isRegistered: boolean;
      companyType?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth" {
  interface User {
    companyType?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        address: {
          label: "Endereço da Carteira",
          type: "text",
          placeholder: "0x...",
        }
      },
      authorize: async (credentials) => {
        const { address } = credentials as {
          address: string;
        };

        try {
          // Verifica se o endereço é válido usando expressão regular
          if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
            throw new Error("Endereço de carteira inválido.");
          }

            return {
              id: address,
              companyType: null,
              name: `User_${address.substring(address.length - 4)}`,
              address: address,
              email: null,
              picture: null,
              isRegistered: false,
            } as CustomUser;
        } catch (error) {
          console.error("Erro na autenticação:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user}) {
      if (user) {
        token.address = user.address;
        token.companyType = user.companyType;
        token.name = user.name;
        token.email = user.email;
        token.isRegistered = user.isRegistered;
      }
      return token;
    },
    async session({ session, token }) {
     if (token && session.user) {
        session.user.address = token.address;
        session.user.companyType = token.companyType as string | null | undefined;
        session.user.name = token.name;

        const business = await prisma.business.findFirst({
            where: {
              hash: {
                equals: token.address,
              },
            },
          });

          if(business){
            session.user = {
              companyType: business.companyType,
              name: business.companyName,
              address: business.hash,
              email: business.email,
              isRegistered: true,
            };
          }
          

        // Remover email e imagem se não existirem
        if (!session.user.email) {
          delete session.user.email;
        }
        if (!session.user.image) {
          delete session.user.image;
        }
      }
      return session;
    },
  },
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET!, // Asserção não nula
};

export default NextAuth(authOptions);
