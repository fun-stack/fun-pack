function patchSourceMap(config) {
  if (!config.module) return config;
  if (!config.module.rules) return config;

  const rules = config.module.rules;

  const index = rules.findIndex(rule => rule.use && rule.use.length == 1 && rule.use[0] == "source-map-loader");
  if (index < 0) return config;

  const rule = rules[index];
  rule.use = ["@fun-stack/source-map-loader-no-warn"];

  return config;
}

module.exports = {patchSourceMap: patchSourceMap};
