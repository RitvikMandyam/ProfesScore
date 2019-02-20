import {Component, Input, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
  animations: [
    trigger('minimizeClassList', [
      state('false', style({height: '0px', minHeight: '0', display: 'none'})),
      state('true', style({height: '*'})),
      transition('false <=> true', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class ScheduleComponent implements OnInit {
  @Input() scheduleClasses: object[];
  @Input() shouldExpandClassList: boolean;

  constructor() { }

  ngOnInit() {
  }

  hideClassList(e: MouseEvent) {
    e.stopPropagation();
    this.shouldExpandClassList = false;
  }
}
