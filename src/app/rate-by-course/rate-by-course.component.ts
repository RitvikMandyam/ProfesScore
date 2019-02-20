import {Component, OnInit, ViewChild} from '@angular/core';
import {BackendDataService} from '../backend-data.service';
import {MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {SortingService} from '../sorting.service';
import {FormControl, FormGroup} from '@angular/forms';
import {checkIfNameMatches, simpleValidator} from '../customValidators';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

@Component({
  selector: 'app-rate-by-course',
  templateUrl: './rate-by-course.component.html',
  styleUrls: ['./rate-by-course.component.css'],
  animations: [
    trigger('moveUp', [
      state('true', style({
        top: '0',
        position: 'relative'
      })),
      state('false', style({
        top: '*',
        position: 'absolute'
      })),
      transition('true <=> false', animate('275ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),  // Run when the table is inserted. Moves the controls up and then back down to make the UI feel more fluid.
    trigger('detailExpand', [
      state('collapsed, void', style({height: '0px', minHeight: '0', display: 'none'})),  // When the table is sorted,
                                                                                                            // void state is entered.
      state('expanded', style({height: '*'})),
      transition('* <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    trigger('shrinkUp', [
      state('false', style({height: '0px', display: 'none'})),
      state('true', style({height: '*', display: 'flex'})),
      transition('true <=> false', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class RateByCourseComponent implements OnInit {
  // noinspection JSMismatchedCollectionQueryUpdate
  depts: object[] = [];  // Departments. Ignore comment above, makes my IDE handle Angular without making me twitch.
  quarters: object[] = [];
  // noinspection JSMismatchedCollectionQueryUpdate
  classes: string[] = [];  // Classes for a given department. See explanation of comment above.
  private profs: object[] = [];  // Professors who teach a given class.
  profsDataSource = new MatTableDataSource(this.profs);  // Makes the table sortable.

  columnsToDisplay = ['teacherfullname_s', 'teacherdepartment_s', 'averageratingscore_rf', 'averageeasyscore_rf',
    'averageclarityscore_rf', 'averagehelpfulscore_rf'];  // Angular's table uses this to decide what values I want displayed.

  filteredDepts: object[];
  filteredClasses: string[];

  // These next six should be pretty self-explanatory.
  shouldShowLoader = false;
  shouldShowTable = false;
  shouldShowControls = true;

  expandedElement: object | null;

  // Angular seems to require this to make the table sortable, as well.
  @ViewChild(MatSort) sort: MatSort;

  classForm = new FormGroup({
    quarter: new FormControl(''),
    department: new FormControl({value: '', disabled: true}),
    class: new FormControl({value: '', disabled: true})
  });
  scheduleClasses: object[] = [];
  shouldExpandClassList = false;

  constructor(private dataService: BackendDataService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    // When page is loaded, get list of departments from backend. Enable the departments dropdown once done.
    this.dataService.getDepartments()
      .subscribe((data: object[]) => {
        this.depts = data['depts'].sort();
        this.quarters = data['quarters'];

        this.classForm.controls['department'].setValidators(checkIfNameMatches(this.depts));
        this.classForm.controls['department'].enable();

        this.classForm.controls['quarter'].setValue(this.quarters[this.quarters.length - 1]['value']);

        this.profsDataSource.sort = this.sort;  // Again, making the table sortable. Why does it need three lines of code? Ask Google.
      });

    this.classForm.controls['department'].valueChanges
      .subscribe((value) => {
        this.filteredDepts = this.filterArray(this.depts, value);
        if (this.classForm.controls['department'].valid) {
          this.onDeptSelected(this.depts[this.depts.findIndex(e => e['name'] === value)]['value']);
        } else {
          this.classForm.controls['class'].disable();
        }
      });

    this.classForm.controls['quarter'].valueChanges
      .subscribe(() => {
        this.onQuarterChanged();
      });

    this.classForm.controls['class'].valueChanges
      .subscribe((value) => {
        this.filteredClasses = this.filterArray(this.classes, value);
        if (this.classForm.controls['class'].valid) {
          this.onClassSelected(this.depts[this.depts.findIndex(e => e['name'] === this.classForm.controls['department'].value)]['value']);
        }
      });
  }

  onQuarterChanged() {
    this.classForm.controls['class'].disable();
    this.classForm.controls['class'].setValue('');
    this.classForm.controls['department'].setValue('');
    this.shouldShowTable = false;
  }

  onDeptSelected(dept) {
    // When a department is selected, get the classes from the backend and enable the classes dropdown.
    this.classForm.controls['class'].disable();
    this.shouldShowTable = false;
    this.dataService.getClasses(dept, this.classForm.controls['quarter'].value)
      .subscribe((data: string[]) => {
        this.classes = data.sort(SortingService.sortAlphanumeric);
        this.filteredClasses = this.classes;
        this.classForm.controls['class'].setValidators(checkIfNameMatches(this.classes, simpleValidator));
        this.classForm.controls['class'].setValue('');
        this.classForm.controls['class'].enable();
      });
  }

  onClassSelected(dept) {
    // When a class is selected, get the professors/ratings from the backend. Show a loader while getting these,
    // then display and populate the table.
    this.shouldShowLoader = true;
    this.dataService.getRatings(dept,
      this.classForm.controls['class'].value, this.classForm.controls['quarter'].value)
      .subscribe((data: object[]) => {
        data = data.filter(e => e['teacherfullname_s']);
        this.profs = data;
        this.profs.forEach((e) => {
          if (e['tag_s_mv']) {
            if (e['tag_s_mv'].length > 3) {
              e['tags'] = e['tag_s_mv'].slice(0, 3).join(' - ');
            } else {
              e['tags'] = e['tag_s_mv'].join(' - ');
            }
          } else {
            e['tags'] = null;
          }
        });
        this.profsDataSource = new MatTableDataSource(this.profs);  // Update the data source for the table.
        this.profsDataSource.sort = this.sort;
        this.shouldShowTable = true;
        this.shouldShowLoader = false;
        this.shouldShowControls = false;
      });
  }

  expandRow(row: object) {
    this.expandedElement = this.expandedElement === row ? null : row;
  }

  filterArray(array, search) {
    return array.filter(e => {
      return e['name'] ? e['name'].toLowerCase().includes(search.toLowerCase()) : e.toLowerCase().includes(search.toLowerCase());
    });
  }

  addClassToSchedule(prof: object | null) {
    if (prof && !this.scheduleClasses.includes(prof)) {
      prof['days_array'] = (prof['days'].replace(/·/g, '') as string).split('');
      prof['class_department'] = this.classForm.controls['department'].value;
      prof['class_name'] = this.classForm.controls['class'].value;
      let conflictingClass;
      if (this.scheduleClasses.length > 0) {
        const current_class_time_array = (prof['times'] as string).split('-').map(e => moment(e, 'h:mm A'));
        const current_class_time = moment.range(current_class_time_array[0], current_class_time_array[1]);
        for (const class_ of this.scheduleClasses) {
          if (!this.scheduleClasses.includes(prof)) {
            if (class_['days_array'].some(e => prof['days_array'].includes(e))) {
              const potential_conflict_time_array = (class_['times'] as string).split('-').map(e => moment(e, 'h:mm A'));
              const potential_conflict_time = moment.range(potential_conflict_time_array[0], potential_conflict_time_array[1]);
              if (potential_conflict_time.overlaps(current_class_time, {adjacent: false})) {
                conflictingClass = class_;
                break;
              }
            }
          }
        }
        if (!conflictingClass) {
          this.scheduleClasses.push(prof);
          this.shouldExpandClassList = true;
          setTimeout(() => this.shouldExpandClassList = false, 3000);
        } else {
          this.snackBar.open(prof['class_name'] + ' conflicts with class ' + conflictingClass['class_name'], '', {duration: 3000});
        }
      } else {
        this.scheduleClasses.push(prof);
        this.shouldExpandClassList = true;
        setTimeout(() => this.shouldExpandClassList = false, 3000);
      }
      console.log(this.scheduleClasses);
    }
  }
}
