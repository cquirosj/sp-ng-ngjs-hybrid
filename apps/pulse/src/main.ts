
//import * as angular from 'angular';
import {module} from 'angular';
import 'angular-route';
//import { IRouteProvider } from 'angular-route';

//import { IRouteService }  from 'angular.route';

/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angularjs/angular-route.d.ts" />

export default module('testApp', ['ngRoute'])
.config(['$routeProvider', function ($routeProvider:  angular.route.IRouteProvider) {
  $routeProvider.when('/Cart', { templateUrl: '/partials/Cart.html', controller: 'checkoutSimulatorCtrl' });
  $routeProvider.otherwise({ redirectTo: '/Cart' });
}])
.controller('checkoutSimulatorCtrl', [function () {
  console.log('Controller initialized')
}])
.run(['$rootScope', function () {
  console.log('angularjs bootstraped'); 
}]);