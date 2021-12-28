(function (window, angular) {
    'use strict';

    angular.module('events.module', []);
    require('./events.route');
    require('./events.controller');
    require('./services/service.auditLog');

} (window, window.angular));


