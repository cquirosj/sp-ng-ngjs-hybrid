(function (window, angular) {
    'use strict';

    const template = require('./messageEditorModal.html');

    function service($uibModal) {
        return {
            displayEditMessageModal: function (failedMessageId, editAndRetryConfig) {
                return $uibModal.open({
                    template: template.default,
                    controller: 'messageEditorModalController',
                    backdrop: 'static',
                    windowTopClass: 'modal-msg-editor',
                    resolve: {
                        failedMessageId: function() {
                            return failedMessageId;
                        },
                        editAndRetryConfig: function() {
                            return editAndRetryConfig;
                        }
                    }
                });               
            }
        };
    }

    service.$inject = ['$uibModal'];

    angular.module("sc")
        .service("messageEditorModalService", service);

})(window, window.angular);
