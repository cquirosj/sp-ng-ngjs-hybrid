(function (window, angular) {
    'use strict';

    const template = require('./archive-view.html');

    function routeProvider($routeProvider) {
        $routeProvider.when('/archived', {
            redirectTo: '/failed-messages/archived'
        }).when('/failed-messages/archived', {
            data: {
                pageTitle: 'Deleted messages'
            },
            template: template.default,
            controller: 'archivedMessageController',
            controllerAs: 'vm'
        });
    }

    routeProvider.$inject = [
        '$routeProvider'
    ];

    angular.module('sc')
        .config(routeProvider);

}(window, window.angular));
