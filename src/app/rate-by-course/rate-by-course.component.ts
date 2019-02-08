import {Component, OnInit, ViewChild} from '@angular/core';
import {BackendDataService} from '../backend-data.service';
import {MatSort, MatTableDataSource} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {SortingService} from '../sorting.service';

@Component({
  selector: 'app-rate-by-course',
  templateUrl: './rate-by-course.component.html',
  styleUrls: ['./rate-by-course.component.css'],
  animations: [
    trigger('moveUp', [
      state('true', style({
        transform: 'translateY(-100%)'
      })),
      state('false', style({
        transform: 'translateY(0)'
      })),
      transition('true => false', animate('275ms ease-out')),
      transition('false => true', animate('275ms ease-in'))
    ]),  // Run when the table is inserted. Moves the controls up and then back down to make the UI feel more fluid.
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class RateByCourseComponent implements OnInit {
  // noinspection JSMismatchedCollectionQueryUpdate
  depts: object[] = [];  // Departments. Ignore comment above, makes my IDE handle Angular without making me twitch.
  // noinspection JSMismatchedCollectionQueryUpdate
  classes: string[] = [];  // Classes for a given department. See explanation of comment above.
  private profs: object[] = [];  // Professors who teach a given class.
  columnsToDisplay = ['teacherfullname_s', 'teacherdepartment_s', 'averageratingscore_rf', 'averageeasyscore_rf',
    'averageclarityscore_rf', 'averagehelpfulscore_rf', 'tags'];  // Angular's table uses this to decide what values I want displayed.
  profsDataSource = new MatTableDataSource(this.profs);  // Makes the table sortable.

  // These next six should be pretty self-explanatory.
  shouldDisableDepts = true;
  shouldDisableClasses = true;
  shouldShowLoader = false;
  shouldShowTable = false;

  private selectedDept: string;
  private selectedClass: string;

  expandedElement: any;

  // Angular seems to require this to make the table sortable, as well.
  @ViewChild(MatSort) sort: MatSort;
  isExpansionDetailRow = (index: number, row: object) => row.hasOwnProperty('detailRow');

  constructor(private dataService: BackendDataService) { }

  ngOnInit() {
    // When page is loaded, get list of departments from backend. Enable the departments dropdown once done.
    this.dataService.getDepartments()
      .subscribe((data: object[]) => {
        this.depts = data.sort();
        this.shouldDisableDepts = false;
    });
    this.profsDataSource.sort = this.sort;  // Again, making the table sortable. Why does it need three lines of code? Ask Google.
  }

  onDeptSelected(dept) {
    // When a department is selected, get the classes from the backend and enable the classes dropdown.
    this.selectedDept = dept;
    this.shouldDisableClasses = true;
    this.shouldShowTable = false;
    this.dataService.getClasses(this.selectedDept)
      .subscribe((data: string[]) => {
        this.classes = data.sort(SortingService.sortAlphanumeric);
        this.shouldDisableClasses = false;
    });
  }
  onClassSelected(class_) {
    // When a class is selected, get the professors/ratings from the backend. Show a loader while getting these,
    // then display and populate the table.
    this.selectedClass = class_;
    this.shouldShowLoader = true;
    this.dataService.getRatings(this.selectedDept, this.selectedClass)
      .subscribe((data: object[]) => {
        data = data.filter(e => e['teacherfullname_s']);
        this.profs = [];
        data.forEach((e) => {
          if (e['tag_s_mv']) {
            if (e['tag_s_mv'].length > 3) {
              e['tags'] = e['tag_s_mv'].slice(0, 3).join(' - ');
            } else {
              e['tags'] = e['tag_s_mv'].join(' - ');
            }
          } else {
            e['tags'] = null;
          }
          this.profs.push(e);
          const detailE = {};
          for (const key of Object.keys(e)) {
            detailE[key] = e[key];
          }
          detailE['detailRow'] = true;
          this.profs.push(detailE);
        });
        this.profsDataSource = new MatTableDataSource(this.profs);  // Update the data source for the table.
        this.profsDataSource.sort = this.sort;
        this.shouldShowTable = true;
        this.shouldShowLoader = false;
      });
  }

  expandRow(row: object) {
    this.expandedElement = row;
  }
}
