(function (window, angular) {
    'use strict';

    const template = require('./pending-retries-view.html');

    function routeProvider($routeProvider) {
        $routeProvider.when('/pendingRetries', {
            redirectTo: '/failed-messages/pending-retries'
        }).when('/failed-messages/pending-retries', {
            data: {
                pageTitle: 'Pending Retries'
            },
            template: template.default,
            controller: 'pendingRetriesController',
            controllerAs: 'vm'
        });
    }

    routeProvider.$inject = [
        '$routeProvider'
    ];

    angular.module('sc')
        .config(routeProvider);

}(window, window.angular));
