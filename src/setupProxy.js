const proxy = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(proxy('/graphql', {
        target: 'https://affectli.dev.mi-c3.com',
        changeOrigin: true,
        secure: false,
    }));
    app.use(proxy('/graphiql', {
        target: 'https://affectli.dev.mi-c3.com',
        changeOrigin: true,
        secure: false,
    }));
    app.use(proxy('/affectli', {
        target: 'https://affectli.dev.mi-c3.com',
        changeOrigin: true,
        secure: false,
    }));
    app.use(proxy('/activiti-app', {
        target: 'https://affectli.dev.mi-c3.com',
        changeOrigin: true,
        secure: false,
    }));
    app.use(proxy('/api', {
        target: 'https://affectli.dev.mi-c3.com',
        changeOrigin: true,
        secure: false,
    }));
    app.use(proxy('/pentaho', {
        target: 'https://affectli.dev.mi-c3.com',
        changeOrigin: true,
        secure: false,
    }));
    app.use(proxy('/kylo', {
        target: 'https://affectli.dev.mi-c3.com',
        changeOrigin: true,
        secure: false,
    }));
    app.use(proxy('/activiti', {
        target: 'https://affectli.dev.mi-c3.com',
        changeOrigin: true,
        secure: false,
    }));

    /*
     * Aff-Platform-FE
     */
    app.use(proxy('/legacy', {
        target: 'https://affectli.dev.mi-c3.com',
        changeOrigin: true,
        secure: false,
    }));
    app.use(proxy('/bower_components', {
        target: 'https://affectli.dev.mi-c3.com',
        changeOrigin: true,
        secure: false,
    }));
    app.use(proxy('/lib', {
        target: 'https://affectli.dev.mi-c3.com',
        changeOrigin: true,
        secure: false,
    }));
    app.use(proxy('/modules', {
        target: 'https://affectli.dev.mi-c3.com',
        changeOrigin: true,
        secure: false,
    }));
};
