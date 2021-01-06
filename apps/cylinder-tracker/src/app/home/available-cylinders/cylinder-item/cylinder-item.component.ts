import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Cylinder, QAGasProfile } from '@cedar-all/core-data';

@Component({
  selector: 'cylinder-tracker-cylinder-item',
  templateUrl: './cylinder-item.component.html',
  styleUrls: ['./cylinder-item.component.scss']
})
export class CylinderItemComponent {
  gasProfileCols = ['unit', 'desc'];

  @Input('cylinder') cylinder: Cylinder;
  @Input('gasProfiles') gasProfiles: QAGasProfile[] = [];
  @Input('isAssignedCylinder') isAssignedCylinder: boolean;
  @Input('disableItemDrag') disableItemDrag = false;
  @Input('cylAssignedProfiles') cylAssignedProfiles = {};
  @Output('cylinderDropped') cylinderDropped = new EventEmitter();
  @Output('retireCylinder') retireCylinder = new EventEmitter();
  @Output('editCylinder') editCylinder = new EventEmitter();
  @Output('filterOtherCard') filterOtherCard = new EventEmitter();

  findAssignedGasProfiles(cylinder: Cylinder) {
    if(this.gasProfiles.length > 0) {
      return this.gasProfiles.filter(gasProfile => gasProfile.cylID === cylinder.cylinderID);
    } 
    return [];
  }

  // // TODO: Serious performance issues
  // findAssignedGasProfilesList(cylinder: Cylinder) {
  //   // console.log(this.called)
  //   // this.called++;
  //   const assignedProfiles = this.findAssignedGasProfiles(cylinder);

  //   let result = [];
  //   assignedProfiles.forEach(profile => {
  //     if(!result.length) {
  //       result.push({unit: profile.unit, desc: "[" + profile.desc + "]"});
  //     }
  //     else {
  //       let found = false;
  //       for(let i = 0; i < result.length; i++) {
  //         if(profile.unit === result[i].unit) {
  //           result[i].desc += " - [" + profile.desc + "]";
  //           found = true;
  //         }
  //       }

  //       if(!found) {
  //         result.push({unit: profile.unit, desc: "[" + profile.desc + "]"});
  //       }
  //     }
  //   })

  //   //console.log(result)

  //   // let unitObject = {};
  //   // let result = [];

  //   // assignedProfiles.forEach(profile => {
  //   //   if(!unitObject[profile.unit]) {
  //   //     unitObject[profile.unit] = `[${profile.desc}]`;
  //   //   }
  //   //   else {
  //   //     unitObject[profile.unit] += ` - [${profile.desc}]`;
  //   //   }
  //   // })
    
  //   // Object.keys(unitObject).forEach(unit => {
  //   //   result.push({unit: `Unit: ${unit}`, desc: unitObject[unit]});
  //   // })

  //   return result;
  // }

  parseDate(dateString: string) {
    return Date.parse(dateString);
  }
}

