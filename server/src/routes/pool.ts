import { FastifyInstance } from "fastify";
import ShortUniqueId from "short-unique-id";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export function poolRoutes(fastify: FastifyInstance) {
  fastify.get("/pools/count", async () => {
    const poolsCount = await prisma.pool.count();
    return { poolsCount };
  });

  fastify.post("/pools", async (request, reply) => {
    const createPoolBody = z.object({
      title: z.string(),
    });
    const { title } = createPoolBody.parse(request.body);
    const generatePoolCode = new ShortUniqueId({ length: 6 });
    const code = String(generatePoolCode()).toUpperCase();
    await prisma.pool.create({
      data: {
        title,
        code,
      },
    });
    return reply.status(201).send({ code });
  });
}
