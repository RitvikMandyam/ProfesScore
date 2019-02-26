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
    ]),
    trigger('showDeleteButton', [
      state('void', style({height: '0px', minHeight: '0', display: 'none'})),
      state('*', style({height: '*'})),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    trigger('classChanged', [
      state('void', style({height: '0px', minHeight: '0', display: 'none'})),
      state('*', style({height: '*'})),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class ScheduleComponent implements OnInit {
  @Input() scheduleClasses: object[];
  @Input() shouldExpandClassList: boolean;
  @Input() classListShrinkTimer: number;
  deleteButtonIndex = -1;

  constructor() { }

  ngOnInit() {
  }

  hideClassList(e: MouseEvent) {
    e.stopPropagation();
    this.shouldExpandClassList = false;
  }

  expandClassList() {
    this.shouldExpandClassList = true;
    if (this.classListShrinkTimer >= 0) {
      clearTimeout(this.classListShrinkTimer);
    }
  }

  showDeleteButton(index) {
    this.deleteButtonIndex === index ? this.deleteButtonIndex = -1 : this.deleteButtonIndex = index;
    if (this.classListShrinkTimer >= 0) {
      clearTimeout(this.classListShrinkTimer);
    }
  }
}
