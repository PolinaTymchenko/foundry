/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "engine-core-must-not-depend-on-consumers",
      comment:
        "packages/generator-core is the reusable engine shared by every current and future generator. " +
        "It must never import from a package that consumes it (starting with create-react-foundry), " +
        "or every future generator built on top of it inherits a dependency on one specific CLI.",
      severity: "error",
      from: { path: "^packages/generator-core" },
      to: { path: "^packages/(?!generator-core)" },
    },
    {
      name: "no-circular",
      comment: "Circular dependencies make packages impossible to version or build independently.",
      severity: "error",
      from: {},
      to: { circular: true },
    },
  ],
  options: {
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: "tsconfig.base.json",
    },
    exclude: {
      path: "(^|/)(dist|node_modules|templates|__tests__)(/|$)",
    },
  },
};
