(function (window, angular) {
    'use strict';

    const template = require('./archivedgroups.html');

    function routeProvider($routeProvider) {
        $routeProvider.when('/archivedgroups', {
            redirectTo: '/archivedgroups/groups'
        }).when('/archivedgroups/groups', {
            data: {
                pageTitle: 'Deleted message groups'
            },
            template: template.default,
            controller: 'archivedMessageGroupsController',
            controllerAs: 'vm'
        });
    }

    routeProvider.$inject = [
        '$routeProvider'
    ];

    angular.module('sc')
        .config(routeProvider);

}(window, window.angular));
