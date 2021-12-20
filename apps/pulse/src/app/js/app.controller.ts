import { IAngularEvent, IController, ILocationService, ILogService, IRootScopeService, IScope, ITimeoutService, IWindowService, module } from 'angular';
import 'angular-route';
import { ConnectionsManager } from '../modules/configuration/connectionsManager';
import { Collapse } from 'bootstrap'
import { NotifyService } from './services/factory.notifier';
import * as angular from 'angular';
import { Stat } from './services/stat';

interface AppCtrlScope extends IScope {
  isActive: (viewLocation: string) => any;
  loadingInitialdata: boolean;
  isSCConnected: boolean;
  isPlatformExpired: boolean;
  isPlatformTrialExpired: boolean;
  isInvalidDueToUpgradeProtectionExpired: boolean;
  licensewarning: string;
  showAlertBadgeOnCollapsedMenu: () => boolean;
  failedcustomchecks: number;
  failedmessages: number;
  failedheartbeats: number;
  disconnectedendpoints: any;
  Version: string;
  newversion: boolean | undefined;
  newspversion: boolean;
  newspversionlink: any;
  newspversionnumber: any;
  newscversion: boolean;
  newscversionlink: any;
  newscversionnumber: any;
  connectionswarning: string | undefined;
  signalRConnectionErrorToast: any;
  isDeleteEndpointsEnabled: boolean;
  isSCConnecting: boolean;
  is_compatible_with_sc: boolean;
  SCVersion: string;
  SCMonitoringVersion: string;
  serviceControlUrl: string;
  isRecoverabilityEnabled: boolean;
  scConnectedAtLeastOnce: boolean;
  loadingInitialData: boolean;
  isMonitoringEnabled: boolean;
}

export class AppCtrl implements IController{
  constructor(
    $scope: AppCtrlScope,
    $log:ILogService,
    $timeout:ITimeoutService,
    $location:ILocationService,
    $window:IWindowService,
    $rootScope:IRootScopeService,
    serviceControlService,
    version,
    toastService,
    signalRListener,
    notifyService: NotifyService,
    semverService,
    connectionsManager: ConnectionsManager,
    uriService,
    licenseNotifierService,
    licenseService,
    license,
    $route:angular.route.IRouteService,
    configurationService,
    monitoringService,
    disconnectedEndpointMonitor,
    platformUpdateService
  ) {
    var notifier = notifyService;

    var scu = connectionsManager.getServiceControlUrl();

    $scope.isMonitoringEnabled = connectionsManager.getIsMonitoringEnabled();

    $scope.loadingInitialData = true;
    $scope.scConnectedAtLeastOnce = false;
    $scope.isRecoverabilityEnabled = scu !== null && scu !== undefined;
    $scope.serviceControlUrl = scu;

    $scope.SCMonitoringVersion = '';
    $scope.SCVersion = '';
    $scope.is_compatible_with_sc = true;
    $scope.SCVersion = version;
    $scope.isSCConnecting = true;

    $scope.isDeleteEndpointsEnabled = false;

    $scope.$on('$locationChangeStart', function (event: IAngularEvent, next, current) {
      var route = $route.routes[$location.path()];
      if (route && !$scope.isSCConnected && !$scope.scConnectedAtLeastOnce) {
        var routeData = route.data;

        if (routeData && routeData.redirectWhenNotConnected) {
          $log.debug(
            'not connected, and never connected once. Current route is a configuration route that requires redirect to: ',
            routeData.redirectWhenNotConnected
          );
          event.preventDefault();
          $location.path(routeData.redirectWhenNotConnected);
        }
      }
    });

    setTimeout(function () {
      // This delay needs to be here for the toastr service to be ready.
      licenseNotifierService.warnOfLicenseProblem(license.license_status);
    }, 3000);

    configurationService
      .isEndpointDeleteSupported()
      .then(function (deleteEnabled: boolean) {
        $scope.isDeleteEndpointsEnabled = deleteEnabled;
      });

    $scope.isPlatformExpired = licenseNotifierService.isPlatformExpired(
      license.license_status
    );
    $scope.isPlatformTrialExpired =
      licenseNotifierService.isPlatformTrialExpired(license.license_status);
    $scope.isInvalidDueToUpgradeProtectionExpired =
      licenseNotifierService.isInvalidDueToUpgradeProtectionExpired(
        license.license_status
      );

    if (
      $scope.isPlatformExpired ||
      $scope.isPlatformTrialExpired ||
      $scope.isInvalidDueToUpgradeProtectionExpired
    ) {
      $scope.licensewarning = 'danger';
    }

    if (licenseNotifierService.isValidWithWarning(license.license_status)) {
      $scope.licensewarning = 'warning';
    }

    $scope.isActive = function (viewLocation:string) {
      var active = $location.path().startsWith(viewLocation);
      return active;
    };

    $($window.document).on('click', function (e) {
      if ($('.navbar-collapse.in').is(':visible')) {
        $('.navbar-collapse.in').collapse('hide');
      }
    });

    $scope.$on(
      '$routeChangeError',
      function (event: IAngularEvent, current, previous, rejection) {
        toastService.showError('Route change error');
      }
    );

    $scope.showAlertBadgeOnCollapsedMenu = function () {
      return (
        ($scope.failedcustomchecks || 0) +
          ($scope.failedmessages || 0) +
          ($scope.failedheartbeats || 0) >
        0
      );
    };

    function customChecksUpdated(event:IAngularEvent, data: any) {
      $timeout(function () {
        //https://davidburgos.blog/correctly-fix-angularjs-error-digest-already-in-progress/
        data = data === 0 || data === '0' ? undefined : data;
        $scope.failedcustomchecks = data;
        logit(event, data);
      });
    }

    function messageFailuresUpdated(event: IAngularEvent, data: any) {
      $timeout(function () {
        data = data === 0 || data === '0' ? undefined : data;
        $scope.failedmessages = data;
        logit(event, data);
      });
    }

    function heartbeatsUpdated(event: IAngularEvent, data: any) {
      $timeout(function () {
        data = data === 0 || data === '0' ? undefined : data;
        $scope.failedheartbeats = data.failing;
        logit(event, data);
      });
    }

    function disconnectedEndpointsUpdated(event: IAngularEvent, data: any) {
      $timeout(function () {
        data = data === 0 || data === '0' ? undefined : data;
        $scope.disconnectedendpoints = data;
        logit(event, data);
      });
    }

    function logit(event: IAngularEvent, data: any) {
      $log.debug(data);
    }

    function checkVersions() {
      $scope.newversion = undefined;

      platformUpdateService.getReleases().then(function (result:any) {
        if (Object.prototype.hasOwnProperty.call(result, 'SP')) {
          if (
            semverService.isUpgradeAvailable(
              $scope.Version,
              result.SP[0]['tag']
            )
          ) {
            $scope.newspversion = true;
            $scope.newspversionlink = result.SP[0]['release'];
            $scope.newspversionnumber = result.SP[0]['tag'];
          }
        }

        if (Object.prototype.hasOwnProperty.call(result, 'SC')) {
          if (
            semverService.isUpgradeAvailable(
              $scope.SCVersion,
              result.SC[0]['tag']
            )
          ) {
            $scope.newscversion = true;
            $scope.newscversionlink = result.SC[0]['release'];
            $scope.newscversionnumber = result.SC[0]['tag'];
          }

          // monitoring version binds much later than SC version, so we need to respond when it changes
          $scope.$watch('scmonitoringversion', function () {
            if (
              semverService.isUpgradeAvailable(
                $scope.SCMonitoringVersion,
                result.SC[0]['tag']
              )
            ) {
              notifier.notify('newmonitoringversionavailable', {
                versionLink: result.SC[0]['release'],
                versionNumber: result.SC[0]['tag'],
              });
            }
          });
        }
      });
    }

    checkVersions();

    notifier.subscribe(
      $scope,
      function (event: IAngularEvent, data: any) {
        if (connectionsManager.getIsMonitoringEnabled()) {
          if (
            (data.status.isSCConnected || data.status.isSCConnecting) &&
            (data.status.isMonitoringConnected ||
              data.status.isMonitoringConnecting ||
              data.status.isMonitoringConnecting === undefined)
          ) {
            $scope.connectionswarning = undefined;
          } else if (
            !data.status.isSCConnected ||
            !data.status.isMonitoringConnected
          ) {
            $scope.connectionswarning = 'danger';
          }
        } else {
          if (data.status.isSCConnected || data.status.isSCConnecting) {
            $scope.connectionswarning = undefined;
          } else if (!data.status.isSCConnected) {
            $scope.connectionswarning = 'danger';
          }
        }

        if (data.status.isSCConnected || data.status.isMonitoringConnected) {
          checkVersions();
        }
      },
      'ConnectionsStatusChanged'
    );

    notifier.subscribe($scope, customChecksUpdated, 'CustomChecksUpdated');
    notifier.subscribe(
      $scope,
      messageFailuresUpdated,
      'MessageFailuresUpdated'
    );
    notifier.subscribe($scope, heartbeatsUpdated, 'HeartbeatsUpdated');

    notifier.subscribe(
      $scope,
      disconnectedEndpointsUpdated,
      disconnectedEndpointMonitor.updatedEvent
    );
    disconnectedEndpointMonitor.startService();

    notifier.subscribe($scope, logit, 'ArchiveGroupRequestAccepted');
    notifier.subscribe($scope, logit, 'RestoreGroupRequestAccepted');

    notifier.subscribe(
      $scope,
      function (event: IAngularEvent, data: any) {
        $scope.SCVersion = data.sc_version;
        $scope.is_compatible_with_sc = data.is_compatible_with_sc;
        $rootScope.supportsArchiveGroups = data.supportsArchiveGroups;

        if (!data.is_compatible_with_sc) {
          var scNeedsUpgradeMessage =
            'You are using Service Control version ' +
            data.sc_version +
            '. Please, upgrade to version ' +
            data.minimum_supported_sc_version +
            ' or higher to unlock new functionality in ServicePulse.';
          toastService.showError(scNeedsUpgradeMessage);
          $location.path('/about');
        }

        checkVersions();
      },
      'EnvironmentUpdated'
    );

    notifier.subscribe(
      $rootScope,
      function (event: IAngularEvent, data: any) {
        if (!$scope.SCMonitoringVersion && data.isMonitoringConnected) {
          monitoringService
            .getServiceControlMonitoringVersion()
            .then(function (data: any) {
              $scope.SCMonitoringVersion = data;

              notifier.notify('monitoringversionloaded', {
                monitoringVersion: data,
              });
            });
        }

        checkVersions();
      },
      'MonitoringConnectionStatusChanged'
    );

    notifier.subscribe(
      $scope,
      function (event: IAngularEvent, data: any) {
        toastService.showError(
          'Your license has expired. Please contact Particular Software support at: <a href="http://particular.net/support">http://particular.net/support</a>'
        );
      },
      'ExpiredLicense'
    );

    notifier.subscribe(
      $scope,
      function (event: IAngularEvent, data: any) {
        logit(event, data);
        toastService.showError(
          'Group' + data.title + ' Restore request rejected'
        );
      },
      'RestoreGroupRequestRejected'
    );

    notifier.subscribe(
      $scope,
      function (event: IAngularEvent, data: any) {
        logit(event, data);
        toastService.showError(
          'Group' + data.title + ' Delete request rejected'
        );
      },
      'ArchiveGroupRequestRejected'
    );

    notifier.subscribe($scope, logit, 'RetryGroupRequestAccepted');

    notifier.subscribe(
      $scope,
      function (event: IAngularEvent, data: any) {
        logit(event, data);
        toastService.showError(
          'Group' + data.title + ' Retry Request Rejected'
        );
      },
      'RetryGroupRequestRejected'
    );

    notifier.subscribe($scope, logit, 'MessageFailedRepeatedly');
    notifier.subscribe($scope, logit, 'MessageFailed');
    notifier.subscribe($scope, logit, 'MessagesSubmittedForRetry');

    notifier.subscribe(
      $scope,
      function (event: IAngularEvent, data: any) {
        logit(event, data);

        switch (data) {
          case 'SignalR starting':
            $scope.isSCConnected = false;
            $scope.isSCConnecting = true;
            break;
          case 'SignalR started':
            $scope.isSCConnected = true;
            $scope.isSCConnecting = false;
            $scope.scConnectedAtLeastOnce = true;
            break;
          case 'Reconnected':
            $scope.isSCConnected = true;
            $scope.isSCConnecting = false;
            $scope.scConnectedAtLeastOnce = true;

            if ($scope.signalRConnectionErrorToast) {
              toastService.clear($scope.signalRConnectionErrorToast);
              $scope.signalRConnectionErrorToast = undefined;
            }
            break;
          default:
            toastService.showWarning(data);
            break;
        }

        notifier.notify('ServiceControlConnectionStatusChanged', {
          isSCConnected: $scope.isSCConnected,
          isSCConnecting: $scope.isSCConnecting,
          scConnectedAtLeastOnce: $scope.scConnectedAtLeastOnce,
        });
      },
      'SignalREvent'
    );

    notifier.subscribe(
      $scope,
      function (event: IAngularEvent, data: any) {
        logit(event, data);

        $scope.isSCConnected = false;
        $scope.isSCConnecting = false;

        notifier.notify('ServiceControlConnectionStatusChanged', {
          isSCConnected: $scope.isSCConnected,
          isSCConnecting: $scope.isSCConnecting,
          scConnectedAtLeastOnce: $scope.scConnectedAtLeastOnce,
        });
      },
      'SignalRError'
    );

    notifier.subscribe(
      $scope,
      function (event: IAngularEvent, data: any) {
        var message = 'There was a problem retrieving your data';
        logit(event, message);
        toastService.showError(message);
      },
      'HttpError'
    );

    $scope.$on('$viewContentLoaded', function (event) {
      if ($scope.loadingInitialdata) {
        if (serviceControlService.performingDataLoadInitially) {
          var unsubscribe = notifier.subscribe(
            $scope,
            function () {
              $scope.loadingInitialData = false;
              unsubscribe();
            },
            'InitialLoadComplete'
          );
        } else {
          $scope.loadingInitialData = false;
        }
      }
    });

    notifier.subscribe(
      $scope,
      function (event: IAngularEvent, data: any) {
        toastService.showInfo(data: any);

        if (
          data ===
          'ServiceControl is busy recreating indexes after a database upgrade...'
        ) {
          $rootScope.busyReindexingDatabase = true;
        } else if (
          data === 'Reindexing after database upgrade has completed.'
        ) {
          $rootScope.busyReindexingDatabase = false;
        }
      },
      'reindexing'
    );

    // signalR Listener
    var listener = signalRListener(uriService.join(scu, 'messagestream'));

    listener.subscribe(
      $scope,
      function (message: string) {
        notifier.notify('SignalREvent', message);
      },
      'SignalREvent'
    );

    listener.subscribe(
      $scope,
      function (message: string) {
        notifier.notify('SignalRError', message);
      },
      'SignalRError'
    );

    listener.subscribe(
      $scope,
      function (message: Stat) {
        notifier.notify('CustomChecksUpdated', message.failed);
      },
      'CustomChecksUpdated'
    );

    listener.subscribe(
      $scope,
      function (message: string) {
        notifier.notify('MessageRedirectCreated', message);
      },
      'MessageRedirectCreated'
    );

    listener.subscribe(
      $scope,
      function (message: string) {
        notifier.notify('MessageRedirectChanged', message);
      },
      'MessageRedirectChanged'
    );

    listener.subscribe(
      $scope,
      function (message: string) {
        notifier.notify('MessageRedirectRemoved', message);
      },
      'MessageRedirectRemoved'
    );

    listener.subscribe(
      $scope,
      function (message: string) {
        notifier.notify('MessageFailed', message);
      },
      'MessageFailed'
    );

    listener.subscribe(
      $scope,
      function (message: string) {
        notifier.notify('MessageFailureResolvedManually', message);
      },
      'MessageFailureResolvedManually'
    );

    listener.subscribe(
      $scope,
      function (message: string) {
        notifier.notify('MessagesSubmittedForRetry', message);
      },
      'MessagesSubmittedForRetry'
    );

    listener.subscribe(
      $scope,
      function (message: string) {
        notifier.notify('MessageFailureResolvedByRetry', message);
      },
      'MessageFailureResolvedByRetry'
    );

    listener.subscribe(
      $scope,
      function (message: any) {
        logit(message);

        notifier.notify(
          'MessageFailuresUpdated',
          message.unresolved_total || message.total
        );
        notifier.notify('ArchivedMessagesUpdated', message.archived_total || 0);
      },
      'MessageFailuresUpdated'
    );

    listener.subscribe(
      $scope,
      function (message: Stat) {
        notifier.notify('HeartbeatsUpdated', {
          failing: message.failing,
          active: message.active,
        });
      },
      'HeartbeatsUpdated'
    );

    listener.subscribe(
      $scope,
      function (message: string) {
        notifier.notify('EventLogItemAdded', message);
      },
      'EventLogItemAdded'
    );

    listener.subscribe(
      $scope,
      function (message: string) {
        notifier.notify('MessagesSubmittedForRetry', message);
      },
      'MessagesSubmittedForRetry'
    );

    listener.subscribe(
      $scope,
      function (message: string) {
        notifier.notify('FailedMessageGroupArchived', message);
      },
      'FailedMessageGroupArchived'
    );

    listener.subscribe(
      $scope,
      function (message: string) {
        notifier.notify('UnarchiveOperationStarting', message);
      },
      'UnarchiveOperationStarting'
    );

    listener.subscribe(
      $scope,
      function (message: string) {
        notifier.notify('UnarchiveOperationBatchCompleted', message);
      },
      'UnarchiveOperationBatchCompleted'
    );

    listener.subscribe(
      $scope,
      function (message: string) {
        notifier.notify('UnarchiveOperationCompleted', message);
      },
      'UnarchiveOperationCompleted'
    );

    listener.subscribe(
      $scope,
      function (message: string) {
        notifier.notify('ArchiveOperationStarting', message);
      },
      'ArchiveOperationStarting'
    );

    listener.subscribe(
      $scope,
      function (message: string) {
        notifier.notify('ArchiveOperationBatchCompleted', message);
      },
      'ArchiveOperationBatchCompleted'
    );

    listener.subscribe(
      $scope,
      function (message: string) {
        notifier.notify('ArchiveOperationCompleted', message);
      },
      'ArchiveOperationCompleted'
    );

    listener.subscribe(
      $scope,
      function (message: string) {
        notifier.notify('RetryOperationWaiting', message);
      },
      'RetryOperationWaiting'
    );

    listener.subscribe(
      $scope,
      function (message: string) {
        notifier.notify('RetryOperationPreparing', message);
      },
      'RetryOperationPreparing'
    );

    listener.subscribe(
      $scope,
      function (message: string) {
        notifier.notify('RetryOperationForwarding', message);
      },
      'RetryOperationForwarding'
    );

    listener.subscribe(
      $scope,
      function (message: string) {
        notifier.notify('RetryOperationForwarded', message);
      },
      'RetryOperationForwarded'
    );

    listener.subscribe(
      $scope,
      function (message: string) {
        notifier.notify('RetryOperationCompleted', message);
      },
      'RetryOperationCompleted'
    );
  }
}


export function register(module: angular.IModule){
    module.controller('AppCtrl',[
        '$scope',
        '$log',
        '$timeout',
        '$location',
        '$window',
        '$rootScope',
        'serviceControlService',
        'version',
        'toastService',
        'signalRListener',
        'notifyService',
        'semverService',
        'connectionsManager',
        'uri',
        'licenseNotifierService',
        'licenseService',
        'license',
        '$route',
        'configurationService',
        'monitoringService',
        'disconnectedEndpointMonitor',
        'platformUpdateService',
        AppCtrl
    ])
}

// controller.$inject = [
//     '$scope',
//     '$log',
//     '$timeout',
//     '$location',
//     '$window',
//     '$rootScope',
//     'serviceControlService',
//     'version',
//     'toastService',
//     'signalRListener',
//     'notifyService',
//     'semverService',
//     'connectionsManager',
//     'uri',
//     'licenseNotifierService',
//     'licenseService',
//     'license',
//     '$route',
//     'configurationService',
//     'monitoringService',
//     'disconnectedEndpointMonitor',
//     'platformUpdateService'
// ];

// angular.module('sc').controller('AppCtrl', controller);


