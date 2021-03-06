"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("gator-utils");
const api = require("gator-api");
function apiHost() {
    return utils.config.env() == 'local' ? 'https://api-host.ngrok.io' : utils.config.settings().apiUrl;
}
exports.apiHost = apiHost;
function launch(application, req, res, callback) {
    let params = {
        appId: application.current.id,
        query: req.query,
        redirect_uri: utils.config.dev() ? 'https://' + req.headers['host'] + '/shopify/install' : 'https://' + utils.config.settings().domain + '/shopify/install'
    };
    api.REST.client.post('/v1/shopify/launch', params, function (err, apiRequest, apiResponse, result) {
        if (apiResponse && apiResponse.statusCode == 300 && result && result.location) {
            res.redirect(result.location);
            if (callback)
                callback(false);
        }
        else if (err) {
            res.sendStatus(500);
            if (callback)
                callback(false);
        }
        else {
            api.setSessionCookie(res, result.data.accessToken);
            req['session'] = result.data;
            api.REST.client.get('/v1/projects?accessToken=' + result.data.accessToken, function (err, apiRequest, apiResponse, result) {
                if (err)
                    req.flash('error', err.message);
                else
                    req['session'].projects = result.data.projects;
                res.redirect(application.branding.postLoginUrl);
                if (callback)
                    callback(true);
            });
        }
    });
}
exports.launch = launch;
function install(application, req, res, callback) {
    let params = {
        appId: application.current.id,
        query: req.query,
        uri: utils.config.dev() ? 'https://' + req.headers['host'] : 'https://' + utils.config.settings().domain,
        partnerId: req.cookies ? req.cookies.partnerId : null
    };
    api.REST.client.post('/v1/shopify/install', params, function (err, apiRequest, apiResponse, result) {
        if (err) {
            callback(err);
        }
        else {
            api.setSessionCookie(res, result.data.accessToken);
            req['session'] = result.data;
            callback();
        }
    });
}
exports.install = install;
function uninstall(application, req, res, callback) {
    let params = {
        appId: application.current.id,
        headers: req.headers,
        body: req['rawBody'],
    };
    api.REST.client.post('/v1/shopify/uninstall', params, function (err, apiRequest, apiResponse, result) {
        callback(err);
    });
}
exports.uninstall = uninstall;
//# sourceMappingURL=shopify.js.map