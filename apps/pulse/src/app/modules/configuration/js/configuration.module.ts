import * as angular from 'angular';
//module('configuration', []);

import './configuration.route';
import './configuration.service';

import './directives/ui.particular.configurationTabs';
import './directives/ui.particular.redirectLink';

import './license/license.module';

import './redirect/redirect.module';

import './connections/connections.module';

import './notifications/notifications.module';

import './platformconnection/platformconnection.module';

angular.module('configuration', [
  'ui.bootstrap',
  'configuration.route',
  'configuration.service',
  'configuration.tabs',
  'configuration.redirect',
  'configuration.license',
  'configuration.connections',
  'configuration.notifications',
  'configuration.platformconnection',
]);
