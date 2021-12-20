(function (window, angular) {
    'use strict';

    const template = require('./ui.particular.exclamation.tpl.html')
    function directive() {
        return {
            scope: {
                type: '@'
            },
            restrict: 'EA',
            replace: true,
            template: template.default,
            link: function (scope, element) { }
        };
    }

    directive.$inject = [];

    angular.module('ui.particular.exclamation', [])
        .directive('exclamation', directive);

}(window, window.angular));