(function(window, angular) {
    'use strict';
    const template = require('./ui.particular.hud.tpl.html');
    function directive() {

        return {
            scope: {
                href: '@',
                icon: '@',
                text: '@',
                totalFailures: '='
            },
            restrict: 'E',
            replace: true,
            template: template.default,
        };
    }

    angular
        .module('ui.particular.hud', [])
        .directive('spHud', directive);

}(window, window.angular));