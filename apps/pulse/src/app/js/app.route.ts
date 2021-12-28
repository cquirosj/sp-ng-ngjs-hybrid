import { getDefaultConfig } from './app.constants';
import { module } from 'angular';
import 'angular-route';

function routeProvider($routeProvider: angular.route.IRouteProvider) {
  $routeProvider.otherwise({ redirectTo: getDefaultConfig().default_route });
}

routeProvider.$inject = ['$routeProvider'];

module('sc').config(routeProvider);
