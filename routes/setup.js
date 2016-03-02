var apiRoutes = require('./api');
var projectRoutes = require('./projects');
var reportingRoutes = require('./reporting');
var segmentRoutes = require('./segments');
var campaignRoutes = require('./campaigns');
var dashboardRoutes = require('./dashboards');
var bookmarkRoutes = require('./bookmarks');
var scheduledReportsRoutes = require('./scheduledReports');
var developerRoutes = require('./developer');
var attributeRoutes = require('./attributes');
var helpRoutes = require('./help');
var accessTokenRoutes = require('./accessTokens');
function setup(app, application, callback) {
    try {
        accessTokenRoutes.setup(app, application, function () {
            helpRoutes.setup(app, application, function () {
                apiRoutes.setup(app, application, function () {
                    attributeRoutes.setup(app, application, function () {
                        scheduledReportsRoutes.setup(app, application, function () {
                            bookmarkRoutes.setup(app, application, function () {
                                dashboardRoutes.setup(app, application, function () {
                                    campaignRoutes.setup(app, application, function () {
                                        projectRoutes.setup(app, application, function () {
                                            reportingRoutes.setup(app, application, function () {
                                                developerRoutes.setup(app, application, function () {
                                                    segmentRoutes.setup(app, application, function () {
                                                        callback();
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }
    catch (err) {
        console.dir(err);
        callback(err);
    }
}
exports.setup = setup;
//# sourceMappingURL=setup.js.map