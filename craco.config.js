const { whenProd } = require('@craco/craco');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    babel: {
        plugins: ['babel-plugin-styled-components', ['@babel/plugin-proposal-decorators', { legacy: true }]]
    },
    eslint: {
        enable: true /* (default value) */,
        mode: 'file'
    },
    webpack: {
        plugins: [...whenProd(() => [new BundleAnalyzerPlugin()], [])]
    }
};
