import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import Fastify from "fastify";
import ShortUniqueId from "short-unique-id";
import { z } from "zod";

const prisma = new PrismaClient({
  log: ["query"],
});

async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: true,
  });

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

  await fastify.listen({ port: 3333 /*host: '0.0.0.0'*/ });
}

bootstrap();
