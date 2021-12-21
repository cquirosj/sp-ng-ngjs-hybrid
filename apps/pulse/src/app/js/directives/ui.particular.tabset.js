(function (window, angular) {
    'use strict';


    function Controller() {
        var self = this;
        self.tabs = [];

        self.addTab = function (tab) {
            self.tabs.push(tab);

            if (self.tabs.length === 1) {

                tab.active = true;
            }
        }

        self.select = function (selectedTab) {
            if (selectedTab.disabled) { return }

            angular.forEach(self.tabs, function (tab) {
                if (tab.active && tab !== selectedTab) {
                    tab.active = false;
                }
            });

            selectedTab.active = true;
        }
    }

    function link(scope, element, attrs) {

    }

    function Directive($window) {

        const template = require('./ui.particular.tabset.tpl.html');

        var directive = {
            restrict: 'E',
            transclude: true,
            scope: {

            },
            template: template.default,
            bindToController: true,
            controllerAs: 'tabset',
            controller: Controller,
            link: link
        };

        return directive;
    }

    Directive.$inject = ['$window'];

    angular
        .module('ui.particular.tabset', [])
        .directive('tabset', Directive);

} (window, window.angular));

