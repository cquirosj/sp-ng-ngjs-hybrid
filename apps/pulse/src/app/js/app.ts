import * as angular from 'angular';
import * as $ from 'jquery' 
import { getDefaultConfig } from './app.constants';

angular.module('sc', [
  'ngRoute',
  'ngAnimate',
  'ngSanitize', //$sce
  'ngClipboard',
  'ngStorage',
  'ngCookies',
  'ngHighlight',
  'toaster',
  'toastService',
  'ui.bootstrap',
  'services',
  'ui.particular',
  'ui.particular.reindexingstatus',
  'directives.moment',
  'eventLogItems',
  'endpoints',
  'monitored_endpoints',
  'endpoint_details',
  'wrappers',
  'customChecks',
  'configuration',
  'dashboard',
  'ui.select',
  'prettyXml',
  'licenseNotifierService',
  'platformexpired',
  'configuration.license',
  'events.module',
  'services.disconnectedEndpointMonitor',
]);

angular.module('sc').run([
  '$rootScope',
  '$location',
  '$log',
  function (
    $rootScope: angular.IRootScopeService,
    $location: angular.ILocationService,
    $log: angular.ILogService
  ) {
    (<any>$rootScope).$log = $log;
  },
]);

const defaultConfig = getDefaultConfig();
angular
  .module('sc')
  .value('$jquery', $)
  .constant('version', defaultConfig.version)
  .constant('showPendingRetry', defaultConfig.showPendingRetry)
  .constant('scConfig', defaultConfig);

angular.module('sc').config([
  '$locationProvider',
  function ($locationProvider:angular.ILocationProvider) {
    $locationProvider.hashPrefix('');
  },
]);
