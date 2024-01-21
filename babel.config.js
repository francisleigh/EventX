module.exports = function (api) {
  api.cache(true);

  const plugins = [];
  plugins.push("react-native-reanimated/plugin");

  const presets = [];
  presets.push("babel-preset-expo");

  return {
    presets,
    plugins,
  };
};
