import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';
import * as angular from 'angular';
import { ConnectionsManager } from './modules/configuration/connectionsManager';
import { SystemStatusComponent } from './js/views/dashboard/system-status.component';

@NgModule({
  declarations: [SystemStatusComponent],
  imports: [BrowserModule, UpgradeModule],
  providers: [],
  bootstrap: [],
})
export class AppModule {
  constructor(private upgrade: UpgradeModule) {}
  ngDoBootstrap() {
    var serviceControlApp = angular.module('sc');

    var injector = angular.injector(['ng']);
    var $http = injector.get('$http');
    var connectionManager: ConnectionsManager = (<any>window)
      .connectionsManager;
    var scUrl = connectionManager.getServiceControlUrl();
    console.debug('Retrieving license from ServiceControl at: ', scUrl);
    var _self = this;
    $http
      .get(scUrl + '/license')
      .then(
        function (response) {
          serviceControlApp.constant('license', response.data);
        },
        function () {
          serviceControlApp.constant('license', {
            license_status: 'Unavailable',
          });
        }
      )
      .then(function () {
        angular.element(document).ready(function () {
          //angular.bootstrap(document, ['sc']);
          _self.upgrade.bootstrap(document.documentElement, ['sc']);
        });
      });
  }
}
