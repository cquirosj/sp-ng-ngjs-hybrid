(function (window, angular) {
    'use strict';

    const template = require('./ui.particular.nodata.tpl.html');

    function directive() {
        return {
            scope: {
                message: '@'
            },
            restrict: 'E',
            replace: true,
            template: template.default,
            link: function (scope, element) { }
        };
    }

    directive.$inject = [];

    angular.module('ui.particular.nodata', [])
        .directive('noData', directive);

}(window, window.angular));