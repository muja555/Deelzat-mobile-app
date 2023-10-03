module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
          '.native.js',
        ],
        alias: {
          modules: './app/modules',
          v2modules: './app/v2modules',
          deelzat: './app/deelzat',
          assets: './assets',
          environments: './app/environments',
          'dz-I19n': './app/v2modules/root/locales',
        },
      },
    ],
    [
      'dotenv-import',
      {
        moduleName: '@env',
        path: '.env',
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: false,
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
