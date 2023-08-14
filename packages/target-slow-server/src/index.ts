import Fastify from "fastify";
const fastify = Fastify({
  logger: true,
});

// Declare a route
fastify.get("/", async function handler(request, reply) {
  const message = await new Promise((res) => {
    setTimeout(() => {
      res({ message: "Send after 2 secs" });
    }, 2000);
  });

  return message;
});

(async () => {
  // Run the server!
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
})();
