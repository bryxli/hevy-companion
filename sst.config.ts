/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "hevy-companion",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const api = new sst.aws.Function("HevyTrpcApi", {
      handler: "packages/functions/src/api.handler",
      url: true,
    });

    return {
      apiUrl: api.url,
    };
  },
});
