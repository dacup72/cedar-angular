import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'ui-select-autocomplete',
  templateUrl: './select-autocomplete.component.html',
  styleUrls: ['./select-autocomplete.component.scss']
})
export class SelectAutocompleteComponent implements OnInit {
  myControl = new FormControl();
  showAuto = false;

  @Input() selectTitle: string = 'Default Title';
  @Input() options: string[] = [];
  @Output() selectionChange = new EventEmitter();
  @ViewChild(MatAutocompleteTrigger) autocomplete: MatAutocompleteTrigger;

  filteredOptions: Observable<string[]>;

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map((item: string | null) => item ? this._filter(item) : this.options.slice())
      );
  }

  displayFn(item: string): string {
    return item ? item : '';
  }

  closePanel() {
    this.autocomplete.closePanel();
  }

  private _filter(name: string): string[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }
}
