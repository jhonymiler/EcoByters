// src/pages/api/register-business.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]"; // Verifique o caminho

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  // Recupera a sessão usando getServerSession
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Não autenticado.' });
  }

  if (req.method === 'POST') {
    const { companyType, companyName, email, phone, city, address, state, hash } = req.body;

    // Validação simples para garantir que todos os campos foram preenchidos
    if (!companyType || !companyName || !email || !phone || !city || !address || !state || !hash) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
      const business = await prisma.business.findFirst({
        where: {
          hash: {
            equals: address,
          },
        },
      });

      if (business) {
        // Atualiza os dados, exceto o companyType
        const updatedBusiness = await prisma.business.update({
          where: {
            id: business.id,
          },
          data: {
            companyName,
            email,
            phone,
            city,
            address,
            state,
            hash,
          },
        });

        return res.status(200).json({ message: 'Empresa já cadastrada, dados atualizados.', updatedBusiness });
      }

      // Insere os dados da empresa no banco de dados junto com o hash da transação
      const company = await prisma.business.create({
        data: {
          companyType,
          companyName,
          email,
          phone,
          city,
          address,
          state,
          hash,
        },
      });

      // Retorna uma mensagem de sucesso
      return res.status(200).json({ message: 'Empresa cadastrada com sucesso', company });
    } catch (error) {
      console.error('Erro ao cadastrar/atualizar empresa:', error);
      return res.status(500).json({ message: 'Erro ao cadastrar ou atualizar empresa.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Método ${req.method} não permitido`);
  }
}
