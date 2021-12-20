export interface IDefaultConfig {
  default_route: string;
  version: string;
  service_control_url: string;
  monitoring_urls: string[];
  showPendingRetry: boolean;
}


(<any>window).defaultConfig = {
    default_route: '/dashboard',
    version: '1.2.0',
    service_control_url: 'http://christianqufe6a:49201/api/',
    monitoring_urls: ['http://christianqufe6a:49205/'],
    showPendingRetry: false,
} as IDefaultConfig;


export function getDefaultConfig() {
    return (<any>window).defaultConfig as IDefaultConfig;
}
