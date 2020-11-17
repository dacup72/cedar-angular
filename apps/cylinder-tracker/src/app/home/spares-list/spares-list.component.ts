import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Cylinder } from '@cedar-all/core-data';
import * as Moment from 'moment';

@Component({
  selector: 'cylinder-tracker-spares-list',
  templateUrl: './spares-list.component.html',
  styleUrls: ['./spares-list.component.scss']
})
export class SparesListComponent {
  spareCylinders: Cylinder[];
  inUseCylinders: Cylinder[];
  filteredSpareCylinders: Cylinder[];
  filteredInUseCylinders: Cylinder[];

  filterItemName = 'Gas Type';
  gasTypes = ['SO2', 'NO', 'NO2', 'NOX', 'N2O', 'CO2', 'CO', 'O2', 'PPN', 'CH4', 'HE', 'H2S', 'BALA', 'BALN', 'APPVD', 'AIR', 'SRM', 'NTRM', 'GMIS', 'RGM', 'PRM', 'ZERO'];
  datePickerTitle="Expiration Date";
  selectTitleCylinder = 'Cylinder ID';
  cylinderIDs: string[] = [];

  selectedFilters = {
    cylinderIDs: [],
    expirationDate: '',
    gases: []
  }

  @Input() set cylinders(value: Cylinder[]) {
    if(value) {
      this.spareCylinders = value.filter(c => c.state === 'spare');
      this.inUseCylinders = value.filter(c => c.state === 'inUse');
      this.cylinderIDs = value.map(c => c.cylinderID);
      this.filterCylinders();
    }
  }
  @Output() cylinderDropped = new EventEmitter();
  @Output() cylinderSelected = new EventEmitter();
  @Output() cylinderDeleted = new EventEmitter();

  filterCylinders() {
    this.filteredSpareCylinders = this.spareCylinders;
    this.filteredInUseCylinders = this.inUseCylinders;

    if(this.selectedFilters.expirationDate) {
      const formattedDate = Moment(this.selectedFilters.expirationDate).format('yyyy-MM-DD');
      this.filteredSpareCylinders = this.filteredSpareCylinders.filter(c => c.expirationDate === formattedDate);
      this.filteredInUseCylinders = this.filteredInUseCylinders.filter(c => c.expirationDate === formattedDate);
    }
    if(this.selectedFilters.cylinderIDs.length > 0) {
      this.selectedFilters.cylinderIDs.forEach(id => {
        this.filteredSpareCylinders = this.filteredSpareCylinders.filter(c => c.cylinderID === id);
        this.filteredInUseCylinders = this.filteredInUseCylinders.filter(c => c.cylinderID === id);
      })
    }
    if(this.selectedFilters.gases.length > 0) {
      this.selectedFilters.gases.forEach(gas => {
        this.filteredSpareCylinders = this.filteredSpareCylinders.filter(c => c.epaGasTypeCodes.includes(gas));
        this.filteredInUseCylinders = this.filteredInUseCylinders.filter(c => c.epaGasTypeCodes.includes(gas));
      })
    }
  }

  gasTypeSelected(gases) {
    this.selectedFilters.gases = gases;
    this.filterCylinders();
  }

  dateSelected(date) {
    this.selectedFilters.expirationDate = date.value;
    this.filterCylinders();
  }

  cylinderIDSelected(ids) {
    this.selectedFilters.cylinderIDs = ids;
    this.filterCylinders();
  }
}
