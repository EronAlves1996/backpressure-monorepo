import axios from "axios";
import Fastify from "fastify";

const fastify = Fastify({ logger: true });

const awaitingPromises: Array<() => Promise<unknown>> = [];

let processingPromises: Array<{
  execute: () => void;
  isFullfilled: boolean;
}> = [];

const backpressureLimit = 180;

let actualBackpressure = 0;

const runResolveLoop = () => {
  if (actualBackpressure < backpressureLimit) {
    actualBackpressure++;
    const promise = awaitingPromises.shift();

    if (promise) {
      const processingPromise = {
        isFullfilled: false,
        execute: () => {
          promise().then(() => {
            processingPromise.isFullfilled = true;

            processingPromises = processingPromises.filter(
              (promise) => !promise.isFullfilled
            );

            actualBackpressure = processingPromises.length;
            runResolveLoop();
          });
        },
      };

      processingPromises.push(processingPromise);
      processingPromise.execute();
    }
  }
};

// Declare a route
fastify.get("/", function handler(request, reply) {
  awaitingPromises.push(() => {
    return axios
      .get("http://localhost:3000/", { httpAgent: false })
      .then((result) => {
        reply.send(result.data);
      });
  });
  runResolveLoop();
});

(async () => {
  // Run the server!
  try {
    await fastify.listen({ port: 3001 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
})();
