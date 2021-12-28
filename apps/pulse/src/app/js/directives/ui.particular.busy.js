(function (window, angular) {
    'use strict';
    const template  = require('./ui.particular.busy.tpl.html');
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

    angular.module('ui.particular.busy', [])
        .directive('busy', directive);

}(window, window.angular));