(function (window, angular) {
    
    'use strict';

    function routeProvider($routeProvider) {
        const template = require('./../views/events-view.html');
        $routeProvider.when('/events', {
            data: {
                pageTitle: 'Events'
            },
            template: template.default,
            controller: 'EventsCtrl',
            controllerAs: 'vm'
        });
    }

    routeProvider.$inject = [
        '$routeProvider'
    ];

    angular.module('events.module')
        .config(routeProvider);

} (window, window.angular));
