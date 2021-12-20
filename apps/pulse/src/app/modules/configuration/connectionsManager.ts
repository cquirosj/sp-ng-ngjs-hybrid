import 'url-search-params-polyfill';
import { module } from 'angular';
import { getDefaultConfig } from '../../js/app.constants';

export class ConnectionsManager {
  private serviceControlUrl: string = '';
  private monitoringUrl: string = '';

  constructor() {
    const urlParams = new URLSearchParams(window.location.search);
    const defaultConfig = getDefaultConfig();

    if (urlParams.has('scu')) {
      this.serviceControlUrl = urlParams.get('scu') || '';
      window.localStorage.setItem('scu', this.serviceControlUrl || '');
      console.debug(
        `ServiceControl Url found in QS and stored in local storage: ${this.serviceControlUrl}`
      );
    } else if (window.localStorage.getItem('scu')) {
      this.serviceControlUrl = window.localStorage.getItem('scu') || '';
      console.debug(
        `ServiceControl Url, not in QS, found in local storage: ${this.serviceControlUrl}`
      );
    } else if (defaultConfig && defaultConfig.service_control_url) {
      this.serviceControlUrl = defaultConfig.service_control_url;
      console.debug(
        `setting ServiceControl Url to its default value: ${defaultConfig.service_control_url}`
      );
    } else {
      console.warn('ServiceControl Url is not defined.');
    }

    if (urlParams.has('mu')) {
      this.monitoringUrl = urlParams.get('mu') || '';
      window.localStorage.setItem('mu', this.monitoringUrl);
      console.debug(
        `Monitoring Url found in QS and stored in local storage: ${this.monitoringUrl}`
      );
    } else if (window.localStorage.getItem('mu')) {
      this.monitoringUrl = window.localStorage.getItem('mu') || '';
      console.debug(
        `Monitoring Url, not in QS, found in local storage: ${this.monitoringUrl}`
      );
    } else if (
      defaultConfig &&
      defaultConfig.monitoring_urls &&
      defaultConfig.monitoring_urls.length
    ) {
      this.monitoringUrl = defaultConfig.monitoring_urls[0];
      console.debug(
        `setting Monitoring Url to its default value: ${defaultConfig.monitoring_urls[0]}`
      );
    } else {
      console.warn('Monitoring Url is not defined.');
    }
  }

  getIsMonitoringEnabled() {
    return (
      this.monitoringUrl !== '!' &&
      this.monitoringUrl !== '' &&
      this.monitoringUrl !== null &&
      this.monitoringUrl !== undefined
    );
  }

  getMonitoringUrl() {
    if (this.getIsMonitoringEnabled()) {
      return this.monitoringUrl;
    }
    return null;
  }

  getServiceControlUrl() {
    return this.serviceControlUrl;
  }

  updateConnections(serviceControlUrl: string, monitoringUrl: string) {
    const urlParams = new URLSearchParams(window.location.search);

    if (!serviceControlUrl) {
      throw 'ServiceControl URL is mandatory';
    }

    urlParams.set('scu', serviceControlUrl);

    if (!monitoringUrl) {
      monitoringUrl = '!'; //disabled
    }

    urlParams.set('mu', monitoringUrl);

    //values have changed. They'll be reset after page reloads
    window.localStorage.removeItem('scu');
    window.localStorage.removeItem('mu');

    let newSearch = urlParams.toString();
    console.debug('updateConnections - new query string: ', newSearch);
    window.location.search = newSearch;
  }
}

export function initConnectionManager() {
  (<any>window).connectionsManager = new ConnectionsManager();

  module('configuration').service('connectionsManager', function () {
    return (<any>window).connectionsManager;
  });
}
