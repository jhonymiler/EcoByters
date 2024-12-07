import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { companyType } = req.query; // Obtém o parâmetro da query
      
      // Constrói a condição dinamicamente
      const whereClause = companyType && typeof companyType === "string"
        ? { companyType }
        : {};

      // Consulta o banco com ou sem filtro
      const businesses = await prisma.business.findMany({
        where: whereClause,
      });

      res.status(200).json(businesses);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar registros", error });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}
