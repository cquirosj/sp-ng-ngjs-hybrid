(function (window, angular) {
    'use strict';

    const template = require('./customChecks.html');

    function routeProvider($routeProvider) {
        $routeProvider.when('/customChecks', {
            redirectTo: '/custom-checks'
        }).when('/custom-checks', {
            data: {
                pageTitle: 'Custom Checks'
            },
            template: template.default,
            controller: 'CustomChecksCtrl',
            controllerAs: 'vm'
        });
    }

    routeProvider.$inject = [
        '$routeProvider'
    ];

    angular.module('customChecks')
           .config(routeProvider);

}(window, window.angular));
