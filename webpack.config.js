const chalk = require("chalk");
const fs = require('fs');
const path = require('path');
const useDefaultConfig = require('@ionic/app-scripts/config/webpack.config.js');

const env = process.env.IONIC_ENV;

if (env === 'prod' || env === 'dev') {

  useDefaultConfig[env].resolve.alias = {
    "@app": path.resolve('./src/app/'),
    "@assets": path.resolve('./src/assets/'),
    "@pages": path.resolve('./src/pages/'),
    "@setup": path.resolve('./src/pages/setup/'),
    "@services": path.resolve('./src/services/'),
    "@tests": path.resolve('./src/'),
    "@theme": path.resolve('./src/theme/')
  };

} else {

  // Default to dev config
  useDefaultConfig[env] = useDefaultConfig.dev;
  useDefaultConfig[env].resolve.alias = {
    "@app": path.resolve('./src/app/'),
    "@assets": path.resolve('./src/assets/'),
    "@pages": path.resolve('./src/pages/'),
    "@setup": path.resolve('./src/pages/setup/'),
    "@services": path.resolve('./src/services/'),
    "@tests": path.resolve('./src/'),
    "@theme": path.resolve('./src/theme/')
  };

}

module.exports = { function () {
  return useDefaultConfig;
},
optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      maxSize: 2000000,
      minChunks: 4,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      automaticNameMaxLength: 30,
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
}
/*
https://github.com/ionic-team/ionic-app-scripts/issues/1271
https://github.com/ionic-team/ionic-app-scripts/blob/master/config/webpack.config.js
module.exports = {
  dev: useDefaultConfig,
  prod: useDefaultConfig
}
*/

/*
"tabs-page": [ "pages/tabs/tabs" ]
"tabs-page": path.resolve('./src/pages/tabs/tabs.ts')
*/