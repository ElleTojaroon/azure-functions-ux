/// <reference path="..\typings\browser.d.ts" />

import {bootstrap} from '@angular/platform-browser-dynamic';
import {HTTP_PROVIDERS} from '@angular/http';
import {AppComponent} from './components/app.component';
import {provide, ExceptionHandler, enableProdMode, Injector} from '@angular/core';
import {FunctionsService} from './services/functions.service';
import {UserService} from './services/user.service';
import {PortalService} from './services/portal.service';
import {BroadcastService} from './services/broadcast.service';
import {FunctionsExceptionHandler} from './handlers/functions.exception-handler';
import {FunctionMonitorService} from './services/function-monitor.service'
import {ArmService} from './services/arm.service';
import {MonitoringService} from './services/app-monitoring.service';
import {TelemetryService} from './services/telemetry.service';
import {UtilitiesService} from './services/utilities.service';
import {BackgroundTasksService} from './services/background-tasks.service';
import {GlobalStateService} from './services/global-state.service';
import {TRANSLATE_PROVIDERS} from 'ng2-translate/ng2-translate';
import {AiService} from './services/ai.service';
import {RBACService} from './services/rbac.service';
import {CacheService} from './services/cache.service';
import {LocalStorageService} from './services/local-storage.service';
import 'rxjs/Rx';

declare var mixpanel: any;

if (window.location.hostname.indexOf('localhost') === -1) {
    enableProdMode();
}

bootstrap(
    AppComponent,
    [
        HTTP_PROVIDERS,
        TRANSLATE_PROVIDERS,
        BroadcastService,
        FunctionsService,
        FunctionMonitorService,
        UserService,
        PortalService,
        provide(ExceptionHandler, {useClass: FunctionsExceptionHandler}),
        RBACService,
        CacheService,
        ArmService,
        LocalStorageService,
        MonitoringService,
        TelemetryService,
        UtilitiesService,
        BackgroundTasksService,
        GlobalStateService,
        AiService
    ]);

if (typeof mixpanel !==  'undefined') {
    var correlationId = getParameterByName("correlationId");
    if (correlationId) {
        mixpanel.identify(correlationId);
    }
}

// http://stackoverflow.com/a/901144
function getParameterByName(name: string): string {
    var url = window.location.href;
    url = url.toLowerCase(); // This is just to avoid case sensitiveness
    name = name.replace(/[\[\]]/g, "\\$&").toLowerCase();// This is just to avoid case sensitiveness for query parameter name
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
