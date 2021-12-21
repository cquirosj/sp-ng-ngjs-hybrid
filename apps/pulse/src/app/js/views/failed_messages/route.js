(function (window, angular) {
    'use strict';

    const template = require('./failed-messages-view.html')

    function routeProvider($routeProvider) {
        $routeProvider.when('/failedMessages', {
            redirectTo: '/failed-messages/all'
        }).when('/failedMessages/:groupId',
            {
                redirectTo: '/failed-messages/groups/:groupId'
            })
            .when('/failed-messages/groups/:groupId', {
                data: {
                    pageTitle: 'Failed Messages'
                },
                template: template.default,
                controller: 'failedMessagesController',
                controllerAs: 'vm'
            }).when('/failed-messages/all', {
                data: {
                    pageTitle: 'Failed Messages'
                },
                template: template.default,
                controller: 'failedMessagesController',
                controllerAs: 'vm'
            });
    }

    routeProvider.$inject = [
        '$routeProvider'
    ];

    angular.module('sc')
        .config(routeProvider);

}(window, window.angular));