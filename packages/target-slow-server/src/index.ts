import Fastify from "fastify";
const fastify = Fastify({
  logger: true,
});

let promiseCount = 0;

// Declare a route
fastify.get("/", function handler(request, reply) {
  promiseCount++;

  new Promise((res) => {
    setTimeout(() => {
      promiseCount--;
      res(reply.send({ message: "Send after 2 secs" }));
    }, 2000);
  });

  if (promiseCount >= 200)
    throw new Error("Server crashed, it has more than 200 processing requests");
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
