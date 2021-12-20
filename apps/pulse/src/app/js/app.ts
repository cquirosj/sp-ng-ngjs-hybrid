import * as $ from 'jquery' 
import {ILocationProvider, ILocationService, ILogService, IRootScopeService, module, injector, element, bootstrap} from 'angular';
import { IDefaultConfig } from './app.constants';
import { initDefaultConfig, getDefaultConfig } from './app.constants'
import { initConnectionManager } from '../modules/configuration/connectionsManager';
import { initConfigurationModule } from '../modules/configuration/js/configuration.module';
import { initAppRouteProvider } from './app.route';
import 'ng-sanitize';

initDefaultConfig();
initConfigurationModule();
initConnectionManager();

export default module('sc', [
        'ngRoute',
        //'ngAnimate',
        //'ngSanitize', //$sce
        //'ngClipboard',
        //'ngStorage',
        // 'ngCookies',
        // 'ngHighlight',
        // 'toaster',
        // 'toastService',
        // 'ui.bootstrap',
        // 'services',
        // 'ui.particular',
        // 'ui.particular.reindexingstatus',
        // 'directives.moment',
        // 'eventLogItems',
        // 'endpoints',
        // 'monitored_endpoints',
        // 'endpoint_details',
        // 'wrappers',
        // 'customChecks',
        // 'configuration',
        // 'dashboard',
        // 'ui.select',
        // 'prettyXml',
        // 'licenseNotifierService',
        // 'platformexpired',
        // 'configuration.license',
        // 'events.module',
        // 'services.disconnectedEndpointMonitor',
    ]);

    module('sc')
        .run(['$rootScope', '$location', '$log', function ($rootScope: IRootScopeService, $location: ILocationService, $log: ILogService) {
            (<any>($rootScope)).$log = $log;
        }]);

        var defaultConfig = getDefaultConfig();

    module('sc')
        .value('$jquery', $)
        .constant('version', defaultConfig.version)
        .constant('showPendingRetry', defaultConfig.showPendingRetry)
        .constant('scConfig', defaultConfig);

    module('sc').config(['$locationProvider', function ($locationProvider: ILocationProvider) {
        $locationProvider.hashPrefix('');
    }]);


    //angular bootstrap
    var serviceControlApp = module('sc');

    var inj = injector(['ng']);
    var $http = inj.get('$http');

    var scUrl:string = (<any>window).connectionsManager.getServiceControlUrl();
    console.debug('Retrieving license from ServiceControl at: ', scUrl);

    $http.get(scUrl + '/license').then(function (response) {

        serviceControlApp.constant('license', response.data);

    }, function () {

        serviceControlApp.constant('license', { 'license_status': 'Unavailable' });

    }).then(function () {

        $(function () {
            bootstrap(document, ['sc']);
        });

    });

    initAppRouteProvider();

/*
    <script src="js/app.js?v=1621602441174"></script>
    <script src="js/app.route.js?v=1621602441174"></script>
    <script src="js/app.controller.js?v=1621602441174"></script>
    <script src="js/app.logging.js?v=1621602441174"></script>
    <script src="js/app.http.js?v=1621602441174"></script>
    <script src="js/app.bootstrap.js?v=1621602441174"></script>
    */