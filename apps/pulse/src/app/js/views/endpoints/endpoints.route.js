(function (window, angular) {

    'use strict';

    const template = require('./endpoints.html');

    function routeProvider($routeProvider) {
        $routeProvider.when('/endpoints', {
            data: {
                pageTitle: 'Endpoints'
            },
            template: template.default,
            controller: 'EndpointsCtrl',
            controllerAs: 'vm'
        });
    }

    routeProvider.$inject = [
        '$routeProvider'
    ];

    angular.module('endpoints')
        .config(routeProvider);

} (window, window.angular));