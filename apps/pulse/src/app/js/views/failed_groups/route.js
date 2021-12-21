(function (window, angular) {
    'use strict';

    const template = require('./failed-groups-view.html');

    function routeProvider($routeProvider) {
        $routeProvider.when('/failedGroups', {
            redirectTo: '/failed-messages/groups'
        }).when('/failed-messages/groups', {
            data: {
                pageTitle: 'Failed Groups'
            },
            template: template.default,
            controller: 'failedMessageGroupsController',
            controllerAs: 'vm'
        });
    }

    routeProvider.$inject = [
        '$routeProvider'
    ];

    angular.module('sc')
        .config(routeProvider);

}(window, window.angular));