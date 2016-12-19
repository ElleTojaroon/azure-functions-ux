﻿import { Component, Input } from '@angular/core';

@Component({
    selector: 'tab',
    styleUrls: ['styles/tabs.style.css'],
    templateUrl: 'app/components/tabs/tab.component.html'
})
export class TabComponent {
    @Input('tabTitle') title: string;
    @Input() active = false;
    @Input() closeable = false;
}