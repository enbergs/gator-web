/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/gator-utils/gator-utils.d.ts" />
/// <reference path="../typings/gator-api/gator-api.d.ts" />
/// <reference path="../typings/express/express.d.ts" />
/// <reference path="../typings/connect-flash/connect-flash.d.ts" />
import utils = require("gator-utils");
import express = require('express');
import restify = require('restify');
import api = require('gator-api');
import {IApplication} from "gator-web";

var gator = require('gator-score');

/*
 Set up routes - this script handles functions required for managing segments
 */

export function setup(app: express.Application, application: IApplication, callback) {

    app.get('/developer/overview', application.enforceSecure, function (req: express.Request, res: express.Response) {
        utils.noCache(res);

        res.render('overview',{
            settings: utils.config.settings(),
            application: application,
            req: req,
        });
    });

    app.get('/developer/web/gettingstarted', application.enforceSecure, function (req: express.Request, res: express.Response) {
        utils.noCache(res);

        res.render('gettingStarted',{
            settings: utils.config.settings(),
            application: application,
            req: req
        });
    });

    app.get('/developer/web/events', application.enforceSecure, function (req: express.Request, res: express.Response) {
        utils.noCache(res);

        res.render('events',{
            settings: utils.config.settings(),
            application: application,
            req: req
        });
    });

    app.get('/developer/web/ecommerce', application.enforceSecure, function (req: express.Request, res: express.Response) {
        utils.noCache(res);

        res.render('ecommerceEvents',{
            settings: utils.config.settings(),
            application: application,
            req: req
        });
    });

    app.get('/developer/web/outboundlinks', application.enforceSecure, function (req: express.Request, res: express.Response) {
        utils.noCache(res);

        res.render('links',{
            settings: utils.config.settings(),
            application: application,
            req: req
        });
    });

    app.get('/developer/web/formposts', application.enforceSecure, function (req: express.Request, res: express.Response) {
        utils.noCache(res);

        res.render('formPosts',{
            settings: utils.config.settings(),
            application: application,
            req: req
        });
    });

    app.get('/developer/web/multipleprojects', application.enforceSecure, function (req: express.Request, res: express.Response) {
        utils.noCache(res);

        res.render('multipleProjects',{
            settings: utils.config.settings(),
            application: application,
            req: req
        });
    });

    app.get('/developer/web/javascriptapi', application.enforceSecure, function (req: express.Request, res: express.Response) {
        utils.noCache(res);

        res.render('javascriptApi',{
            settings: utils.config.settings(),
            application: application,
            req: req
        });
    });

    app.get('/developer/attributes', application.enforceSecure, function (req: express.Request, res: express.Response) {
        utils.noCache(res);

        res.render('attributeList',{
            settings: utils.config.settings(),
            application: application,
            req: req,
            attributes: api.reporting.getAttributes('all', api.reporting.AttributeTypes.all, false)
        });
    });

    app.get('/developer/tools/querytester', application.enforceSecure, api.authenticate, function (req: express.Request, res: express.Response) {
        utils.noCache(res);

        if (req.query.query) {
            req.params.query = JSON.parse(req.query.query);
        }

        if (!req.params.query) {
            req.params.query = {
                projectId: req['session'].currentProjectId,
                timezone: req['session'].user.timezoneId,
                timeframe: 'today',
                group: 'browser',
                sort: { 'sessions': -1 },
                attributes: "sessions"
            }
        }

        res.render('queryTester', {
            application: application,
            req: req
        });
    });

    app.get('/developer/rest', application.enforceSecure, function (req: express.Request, res: express.Response) {
        utils.noCache(res);

        res.render('restOverview',{
            settings: utils.config.settings(),
            application: application,
            req: req,
            timezones: utils.epoch.timezones
        });
    });

    app.get('/developer/querylanguage', application.enforceSecure, function (req: express.Request, res: express.Response) {
        utils.noCache(res);

        res.render('queryLanguage',{
            settings: utils.config.settings(),
            application: application,
            req: req,
            timezones: utils.epoch.timezones
        });
    });

    app.get('/developer/accesstokens', application.enforceSecure, function (req: express.Request, res: express.Response) {
        utils.noCache(res);

        res.render('accessTokensHelp',{
            settings: utils.config.settings(),
            application: application,
            req: req
        });
    });

    app.get('/developer/scoring', application.enforceSecure, function (req: express.Request, res: express.Response) {
        utils.noCache(res);

        res.render('scoringHelp',{
            settings: utils.config.settings(),
            application: application,
            req: req
        });
    });

    app.get('/developer/scoring/node', application.enforceSecure, function (req: express.Request, res: express.Response) {
        utils.noCache(res);

        res.render('scoringNode',{
            settings: utils.config.settings(),
            application: application,
            req: req
        });
    });

    app.get('/developer/scoring/dotnet', application.enforceSecure, function (req: express.Request, res: express.Response) {
        utils.noCache(res);

        res.render('scoringDotnet',{
            settings: utils.config.settings(),
            application: application,
            req: req
        });
    });

    app.get('/developer/scoring/https', application.enforceSecure, function (req: express.Request, res: express.Response) {
        utils.noCache(res);

        res.render('scoringHttps',{
            settings: utils.config.settings(),
            application: application,
            req: req
        });
    });

    app.get('/developer/scoring/curl', application.enforceSecure, function (req: express.Request, res: express.Response) {
        utils.noCache(res);

        res.render('scoringCurl',{
            settings: utils.config.settings(),
            application: application,
            req: req
        });
    });

    app.get('/developer/scoring/test', application.enforceSecure, function (req: express.Request, res: express.Response) {
        utils.noCache(res);

        var options: any = {
            accessToken: 'cB9nC1h5OHB19ABdePAyLiJgT0BN1JMm',
            ip: utils.ip.remoteAddress(req),
            ua: req.headers['user-agent'],
            referrer: req.headers['referer'],
            url: req.hostname,
            timeout: 900
        };

        if (process.env['NODE_ENV'] == 'local') {
            options.apiHost = '127.0.0.5';
            options.apiPort =8080;
            options.apiProtocol= 'http';
            options.ip = '72.23.32.45';
        }
        gator.score(options, function(err, result) {

            if (err)
                result = err;
            else if (!result)
                result = { code: 500, message: 'No result returned' };

            delete options.accessToken;

            res.render('scoringTest',{
                settings: utils.config.settings(),
                application: application,
                req: req,
                result: result,
                options: options
            });
        });
    });

    callback();
}
