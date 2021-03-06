"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("gator-utils");
const api = require("gator-api");
const lib = require("../lib/index");
function getDashboard(application, req, res) {
    utils.noCache(res);
    let dashboards, name = req.query.name, template = req.query.template, dashboard = {}, editable = true;
    if (template) {
        editable = false;
        dashboard = application['getDashboardTemplate'](template, req.query);
    }
    else if (name) {
        dashboards = api.reporting.currentDashboards(req);
        dashboard = dashboards[name];
    }
    else if (typeof application.defaultDashboard == 'function') {
        dashboard = application.defaultDashboard();
    }
    if (dashboard) {
        dashboard.pods = dashboard.pods || [];
        for (let i = 0; i < dashboard.pods.length; i++) {
            let pod = JSON.parse(dashboard.pods[i]);
            if (pod.state && pod.state.id) {
                let report = application.reports.definitions[application.reports.Types[pod.state.id]];
                pod.settings = report ? report.settings : {};
                if (report.initialState) {
                    for (let key in report.initialState) {
                        if (report.initialState.hasOwnProperty(key) && !pod.state.hasOwnProperty(key))
                            pod.state[key] = report.initialState[key];
                    }
                }
            }
            pod.settings = pod.settings || {};
            if (pod.state.renderView)
                pod.settings.renderView = pod.state.renderView;
            if (pod.state.title)
                pod.settings.title = pod.state.title;
            if (pod.state.hasOwnProperty('isLog'))
                pod.settings.isLog = pod.state.isLog;
            if (!pod.settings.intervals)
                pod.settings.intervals = application.reports['intervals'];
            if (!pod.settings.ranges)
                pod.settings.ranges = application.reports['ranges'];
            if (!pod.state.dateLabel && pod.settings.intervals && pod.settings.intervals.defaultRange)
                pod.state.dateLabel = pod.settings.intervals.defaultRange;
            else if (!pod.state.dateLabel)
                pod.state.dateLabel = 'Last 30 Days';
            if (!pod.state.dateInterval && pod.settings.intervals && pod.settings.intervals.defaultOption)
                pod.state.dateInterval = pod.settings.intervals.defaultOption;
            else if (!pod.state.dateInterval)
                pod.state.dateInterval = 'Daily';
            dashboard.pods[i] = JSON.stringify(pod);
        }
    }
    else {
        req.flash('error', 'No such dashboard');
    }
    let view = 'dashboard';
    res.render(view, {
        application: application,
        settings: utils.config.settings(),
        req: req,
        dashboardName: name,
        dashboard: dashboard,
        title: req.query.title || '',
        editable: editable
    });
}
exports.getDashboard = getDashboard;
function setup(app, application, callback) {
    let statusCheck = typeof application.statusCheck == 'function' ? application.statusCheck : lib.statusCheckPlaceholder;
    app.get('/setup/dashboards', application.enforceSecure, api.authenticate, function (req, res) {
        utils.noCache(res);
        api.REST.client.get('/v1/projects?accessToken=' + req['session']['accessToken'], function (err, apiRequest, apiResponse, result) {
            if (err)
                req.flash('error', err.message);
            else
                req['session'].projects = result.data.projects;
            res.render('dashboards', {
                application: application,
                settings: utils.config.settings(),
                dashboards: api.reporting.currentDashboards(req),
                req: req
            });
        });
    });
    app.put('/setup/dashboards', application.enforceSecure, api.authenticate, function (req, res) {
        let params = {
            accessToken: req['session'].accessToken,
            projectId: req['session'].currentProjectId,
            dashboards: req.body.dashboards
        };
        api.REST.client.put('/v1/projects/dashboards', params, function (err, apiRequest, apiResponse, result) {
            api.REST.sendConditional(res, err);
        });
    });
    app.post('/setup/dashboards/pods', application.enforceSecure, api.authenticate, function (req, res) {
        let dashboards = api.reporting.currentDashboards(req);
        let pod = {
            display: req.body.display,
            title: req.body.title,
            state: req.body.state
        };
        dashboards[req.body.name].pods = dashboards[req.body.name].pods || [];
        dashboards[req.body.name].pods.push(JSON.stringify(pod));
        let params = {
            accessToken: req['session'].accessToken,
            projectId: req['session'].currentProjectId,
            dashboards: dashboards
        };
        api.REST.client.put('/v1/projects/dashboards', params, function (err, apiRequest, apiResponse, result) {
            api.REST.sendConditional(res, err);
        });
    });
    app.post('/setup/dashboards/order', application.enforceSecure, api.authenticate, function (req, res) {
        let dashboards = api.reporting.currentDashboards(req);
        let newOrder = [];
        for (let i = 0; i < req.body.order.length; i++) {
            if (dashboards[req.body.name].pods[req.body.order[i]])
                newOrder.push(utils.clone(dashboards[req.body.name].pods[req.body.order[i]]));
        }
        dashboards[req.body.name].pods = newOrder;
        let params = {
            accessToken: req['session'].accessToken,
            projectId: req['session'].currentProjectId,
            dashboards: dashboards
        };
        api.REST.client.put('/v1/projects/dashboards', params, function (err, apiRequest, apiResponse, result) {
            api.REST.sendConditional(res, err);
        });
    });
    app.delete('/setup/dashboards/pods', application.enforceSecure, api.authenticate, function (req, res) {
        let dashboards = api.reporting.currentDashboards(req);
        let dashboard = dashboards[req.body.name];
        dashboard.pods.splice(+req.body.pod, 1);
        let params = {
            accessToken: req['session'].accessToken,
            projectId: req['session'].currentProjectId,
            dashboards: dashboards
        };
        api.REST.client.put('/v1/projects/dashboards', params, function (err, apiRequest, apiResponse, result) {
            api.REST.sendConditional(res, err);
        });
    });
    app.get('/dashboard', application.enforceSecure, api.authenticate, statusCheck, function (req, res) {
        getDashboard(application, req, res);
    });
    callback();
}
exports.setup = setup;
//# sourceMappingURL=dashboards.js.map