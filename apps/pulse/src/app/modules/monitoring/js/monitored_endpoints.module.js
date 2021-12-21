(function (window, angular) {
  'use strict';
  angular.module('monitored_endpoints', []);

  require('./services/services.monitoring');
  require('./services/services.connectivityNotifier');
  require('./services/services.endpointGrouping');
  require('./monitored_endpoints.controller');
  require('./monitored_endpoints.route.js');
  require('./constant.diagrams.js');

  require('./directives/ui.particular.monitoringConnectivityStatus.js');
  require('./directives/ui.particular.graph.js');
  require('./directives/ui.particular.graphdecimal.js');
  require('./directives/ui.particular.graphduration.js');
  require('./directives/ui.particular.metricsLargenumber.js');
  require('./directives/ui.particular.sortableColumn.js');

  angular
    .module('monitored_endpoints')
    .directive('monitoredEndpointsListGrouped', function () {
      return {
        restrict: 'E',
        template: require('./../views/monitored_endpoints_list_grouped.html').default,
      };
    })
    .directive('monitoredEndpointsList', function () {
      return {
        restrict: 'E',
        template: require('./../views/monitored_endpoints_list.html').default,
      };
    })
    .directive('monitoringNotAvailable', function () {
        return {
          restrict: 'E',
          template: require('./../views/monitoring_not_available.html').default,
        };
      })
      .directive('monitoring_no_data', function () {
        return {
          restrict: 'E',
          template: require('./../views/monitoring_no_data.html').default,
        };
      })
    ;
})(window, window.angular);
