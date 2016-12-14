import {Component, Input, OnChanges, SimpleChange} from '@angular/core';
import {FunctionInfo} from '../models/function-info';
import {CORE_DIRECTIVES} from '@angular/common';
import {TableFunctionMonitor} from './table-function-monitor.component';
import {AggregateBlock} from './aggregate-block.component';
import {FunctionMonitorService} from '../services/function-monitor.service';
import {FunctionInvocations} from '../models/function-monitor';
import {Observable, Subscription as RxSubscription} from 'rxjs/Rx';
import {GlobalStateService} from '../services/global-state.service';
import {PortalService} from '../services/portal.service';
import {TranslateService, TranslatePipe} from 'ng2-translate/ng2-translate';
import {PortalResources} from '../models/portal-resources';

@Component({
    selector: 'function-monitor',
    templateUrl: 'templates/function-monitoring.component.html',
    directives: [CORE_DIRECTIVES, TableFunctionMonitor, AggregateBlock],
    pipes: [TranslatePipe]
})
export class FunctionMonitorComponent implements OnChanges {
    @Input() selectedFunction: FunctionInfo;
    public pulseUrl: string;
    public rows: FunctionInvocations[]; // the data for the InvocationsLog table
    private timer: RxSubscription;
    public successAggregateHeading: string;
    public errorsAggregateHeading: string;
    public successAggregate: string;
    public errorsAggregate: string;
    public columns: any[];
    public functionId: string;

    constructor(
        private _functionMonitorService: FunctionMonitorService,
        private _portalService: PortalService,
        private _globalStateService: GlobalStateService,
        private _translateService: TranslateService) { }


    ngOnChanges(changes: { [key: string]: SimpleChange }) {
        this._globalStateService.setBusyState();
        this.successAggregate = this.errorsAggregate = this._translateService.instant(PortalResources.functionMonitor_loading);
        this.columns = [
            {
                display: this._translateService.instant(PortalResources.functionMonitorTable_functionColumn), //The display text
                variable: "functionDisplayTitle", //The  key that maps to the data property
                formatTo: "text" // The type data for the column (date converts to fromNow etc)
            },
            {
                display: this._translateService.instant(PortalResources.functionMonitorTable_statusColumn),
                variable: "status",
                formatTo: "icon"
            },
            {
                display: this._translateService.instant(PortalResources.functionMonitorTable_detailsColumn),
                variable: "whenUtc",
                formatTo: "datetime"
            },
            {
                display: this._translateService.instant(PortalResources.functionMonitorTable_durationColumn),
                variable: "duration",
                formatTo: "number"
            }
        ];
        let site = this.selectedFunction.functionApp.getSiteName();
        this.successAggregateHeading = this._translateService.instant(PortalResources.functionMonitor_successAggregate);
        this.errorsAggregateHeading = this._translateService.instant(PortalResources.functionMonitor_errorsAggregate);
        this.selectedFunction.functionApp.getFunctionAppId().subscribe(host => {
            var hostId = !!host ? host : "";
            this._functionMonitorService.getDataForSelectedFunction(this.selectedFunction, hostId).subscribe(data => {
                this.functionId = !!data ? data.functionId : "";
                this.successAggregate = !!data ? data.successCount.toString() : 
                    this._translateService.instant(PortalResources.appMonitoring_noData);
                this.errorsAggregate = !!data ? data.failedCount.toString() : 
                    this._translateService.instant(PortalResources.appMonitoring_noData);

                // if no data from function monitoring we don't call the Invocations API since this will return 404
                if (!!data) {
                    this._functionMonitorService.getInvocationsDataForSelctedFunction(this.selectedFunction.functionApp, this.functionId).subscribe(result => {
                        this.rows = result;
                        this._globalStateService.clearBusyState();
                    });
                } else {
                    this._globalStateService.clearBusyState();
                }
            });
        });

        this.pulseUrl = `https://support-bay.scm.azurewebsites.net/Support.functionsmetrics/#/${site}/${this.selectedFunction.name}`;
    }
}