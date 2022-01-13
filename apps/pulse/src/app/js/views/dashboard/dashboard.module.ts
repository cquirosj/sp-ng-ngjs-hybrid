import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';
import { SystemStatusComponent } from './system-status.component';

angular.module('dashboard', [])
.directive(
    'systemStatus',
    downgradeComponent({ component: SystemStatusComponent }) as angular.IDirectiveFactory
  );

