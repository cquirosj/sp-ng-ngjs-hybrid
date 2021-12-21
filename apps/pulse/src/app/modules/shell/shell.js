require('expose-loader?exposes=$,jQuery!jquery');
require('expose-loader?exposes=d3!d3');
require('angular?exposes=angular');
require('angular-animate');
require('angular-route');
require('angular-sanitize');
require('jquery-csv');
require('ngstorage');
require('angular-cookies');
require('angular-ui-bootstrap');
require('bootstrap');
require('zeroclipboard');
require('moment');
require('moment-duration-format');
require('angularjs-toaster');
require('signalr');
require('ui-select');

require('rx');
require('expose-loader?exposes=hljs!highlight.js')
require('expose-loader?exposes=hljsbg!highlightjs-badge')
require('bootstrap/dist/css/bootstrap.css');
require('highlight.js/styles/stackoverflow-dark.css');
require('angularjs-toaster/toaster.css');
require('animate.css/animate.css');
require('ui-select/dist/select.css');
require('./constant.moment');
require('angular-pretty-xml');
require('./js/directives/ui.particular.reindexingStatus');
require('./js/services/service.toast');
require('./js/directives/platformExpired');
require('./js/licensenotifier/license.notifier');
require('./js/events.module.js');

// document.addEventListener('DOMContentLoaded', function () {
//   jQuery(function () {

//   });
// });
