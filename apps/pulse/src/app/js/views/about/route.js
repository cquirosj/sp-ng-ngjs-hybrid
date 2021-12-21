(function (window, angular) {
    'use strict';
    
    const template = require('./about-view.html');

    function routeProvider($routeProvider) {
        $routeProvider.when('/about', {
            data: {
                pageTitle: 'About'
            },
            template: template.default,
            controller: 'aboutController',
            controllerAs: 'vm'
        });
    }

    routeProvider.$inject = [
        '$routeProvider'
    ];

    angular.module('sc')
        .config(routeProvider);

}(window, window.angular));