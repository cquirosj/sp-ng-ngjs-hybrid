import {
  IAngularEvent,
  ILogService,
  IRootScopeService,
  IScope,
  module,
} from 'angular';

// function factory($rootScope: IRootScopeService, $log: ILogService) {
//   function notifier() {
//     return {
//       subscribe: function (scope: IScope, callback: Function, event: string) {
//         var handler = $rootScope.$on(
//           event,
//           function (event: IAngularEvent, data: any) {
//             $log.debug({ e: event, d: data });
//             callback(event, data);
//           }
//         );
//         scope.$on('$destroy', handler);

//         return handler;
//       },
//       notify: function (event: string, data: any) {
//         $rootScope.$emit(event, data);
//       },
//     };
//   }

//   return notifier;
// }
export class NotifyService {
  constructor(
    private $rootScope: IRootScopeService,
    private $log: ILogService
  ) {}

  subscribe(scope: IScope, callback: Function, event: string) {
    var _self = this;
    var handler = this.$rootScope.$on(
      event,
      function (event: IAngularEvent, data: any) {
        _self.$log.debug({ e: event, d: data });
        callback(event, data);
      }
    );

    scope.$on('$destroy', handler);

    return handler;
  }

  notify(event: string, data: any) {
    this.$rootScope.$emit(event, data);
  }
}

export function initNotifyService() {
  //module('sc').service('notifyService', ['$rootScope', '$log', factory]);
  module('sc').service('notifyService', ['$rootScope', '$log', NotifyService]);
}
