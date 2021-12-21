import * as angular from 'angular';

class SeNotAvailableComponentController {
  constructor() {}  
}

export const ScNotAvailableComponent = {
  bindings: {
    scUrl: '=',
  },
  template: `
    <div class="text-center monitoring-no-data">
        <h1>Cannot connect to ServiceControl</h1>
        <p>
            ServicePulse is unable to connect to the ServiceControl instance at <span id="serviceControlUrl">{{$ctrl.scUrl}}</span>. Please ensure that ServiceControl is running and accessible from your machine.
        </p>
        <div class="action-toolbar">
            <a href="#/configuration/connections" class="btn btn-default btn-primary">View Connection Details</a> <a class="btn btn-default btn-secondary" href="https://docs.particular.net/monitoring/metrics/">Learn more</a>
        </div>
    </div>
    `,
  controller: SeNotAvailableComponentController,
};

angular.module('sc').component('scNotAvailable',ScNotAvailableComponent)
