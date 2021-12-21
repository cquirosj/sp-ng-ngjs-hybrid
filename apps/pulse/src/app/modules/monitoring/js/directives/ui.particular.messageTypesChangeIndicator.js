(function (window, angular, $) {
    'use strict';
    const template = require('./ui.particular.messageTypesChangeIndicator.tpl.html');
    angular.module('ui.particular.messageTypesChangeIndicator', [])
        .directive('messageTypesChangeIndicator',
            function() {
                return {
                    restrict: 'E',
                    scope: {
                        refresh: '=',
                        messageTypesAvailable: '='
                    },
                    template: template.default,
                    link: function link(scope, element, attrs) {
                        $(window).on('load scroll', function () {
                            if ($(this).scrollTop() > 510) {
                                $('.endpoint-data-changed').addClass('sticky');
                                $('.table-head-row').addClass('add-top-margin');
                            } else {
                                $('.endpoint-data-changed').removeClass('sticky');
                                $('.table-head-row').removeClass('add-top-margin');
                            }
                        });
                    }
                };
            });
}(window, window.angular, window.jQuery));