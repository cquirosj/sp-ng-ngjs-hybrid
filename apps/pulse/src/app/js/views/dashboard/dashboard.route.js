(function (window, angular) {
    
    'use strict';

    const template = require('./dashboard.html');
    function routeProvider($routeProvider) {
        $routeProvider.when('/dashboard', {
            data: {
                pageTitle: "Dashboard"
            },
            template: template.default,
            controller: 'DashboardCtrl',
            controllerAs: 'vm'
        });
    }

    routeProvider.$inject = [
        '$routeProvider'
    ];

    angular.module('dashboard')
        .config(routeProvider);

} (window, window.angular));