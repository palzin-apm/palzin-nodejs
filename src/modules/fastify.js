"use strict";

const fp = require("fastify-plugin");
const utils = require('./utils');

module.exports = function (palzin, opts = {}) {
  return fp(
    function (fastify, intOpts, next) {
      if (!fastify.palzin) {
        fastify.decorate("palzin", palzin);
      }

      fastify.addHook("onRequest", (request, reply, done) => {
        const method = request.routerMethod || request.raw.method; // Fallback for fastify >3 <3.3.0
        const url = request.routerPath || reply.context.config.url; // Fallback for fastify >3 <3.3.0

        let shouldBeMonitored = true;

        if (Array.isArray(opts.excludePaths)) {
          for (let rule in opts.excludePaths) {
            if (utils.wildcardMatchRule(url, opts.excludePaths[rule])) {
              shouldBeMonitored = false;
              break;
            }
          }
        }

        if (shouldBeMonitored) {
          const transaction = fastify.palzin.startTransaction(method + " " + url);

          transaction.addContext("Url", {
            params: request.params,
            query: request.query,
            url: request.url,
          });
        }

        done();
      });

      fastify.addHook("onResponse", (request, reply, done) => {
        const transaction = fastify.palzin.currentTransaction();
        if (transaction) {
          transaction.setResult("" + reply.statusCode);

          transaction.addContext("Body", request.body);

          transaction.addContext("Response", {
            status_code: reply.statusCode,
            headers: reply.getHeaders(),
          });

          transaction.end();
          palzin.flush();
        }
        done();
      });

      next();
    },
    { name: "palzin-fastify" }
  );
};
