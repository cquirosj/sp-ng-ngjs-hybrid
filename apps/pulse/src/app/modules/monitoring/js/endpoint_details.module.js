(function(window, angular) {
    'use strict';

    angular.module('endpoint_details', []);

    require('./services/services.messageTypeParser');
    require('./services/services.connectivityNotifier');
    require('./endpoint_details.controller');
    require('./endpoint_details.route');
    require('./constant.diagrams');

    require('./directives/ui.particular.monitoringConnectivityStatus');
    require('./directives/ui.particular.graph');
    require('./directives/ui.particular.graphdecimal');
    require('./directives/ui.particular.duration');
    require('./directives/ui.particular.graphduration');
    require('./directives/ui.particular.largeGraph');
    require('./directives/ui.particular.metricsLargenumber');
    require('./directives/ui.particular.messageTypesChangeIndicator');
}(window, window.angular));