import { Component, Input } from '@angular/core';

@Component(
    {
        selector:'system-status',
        template:`
        <div class="row box system-status">
                    <div class="col-sm-12">
                        <div class="row">
                            <div class="col-xs-4">
                                <a class="summary-item" [ngClass]="{  'summary-danger' : failedheartbeats > 0 , 'summary-info' : failedheartbeats === 0 || !failedheartbeats  }" href="#/endpoints">
                                    <i class="fa fa-heartbeat fa-3x"></i>
                                    <span ng-show="failedheartbeats > 0" class="badge badge-important">{{failedheartbeats}}</span>
                                    <h4>
                                        Heartbeats
                                    </h4>
                                </a>

                            </div>
                            <div class="col-xs-4">
                                <a class="summary-item" [ngClass]="{  'summary-danger'  : failedmessages > 0 , 'summary-info' : failedmessages === 0 || !failedmessages }" href="#/failed-messages/groups">
                                    <i class="fa fa-envelope fa-3x "></i>
                                    <span ng-show="failedmessages > 0" class="badge badge-important">{{failedmessages}}</span>
                                    <h4>
                                        Failed Messages
                                    </h4>
                                </a>
                            </div>
                            <div class="col-xs-4">
                                <a class="summary-item" [ngClass]="{  'summary-danger'  : failedcustomchecks > 0, 'summary-info' : failedcustomchecks === 0 || !failedcustomchecks }" href="#/custom-checks">
                                    <i class="fa fa-check  fa-3x "></i>
                                    <span ng-show="failedcustomchecks > 0" class="badge badge-important">{{failedcustomchecks}}</span>
                                    <h4>
                                        Custom Checks
                                    </h4>
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
        `
    }
)
export class SystemStatusComponent {

    @Input() failedheartbeats: number = 0;
    @Input() failedmessages: number = 0;
    @Input() failedcustomchecks: number = 0;
}