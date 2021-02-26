import { Pipe, PipeTransform } from '@angular/core';
import { Cylinder, CylinderFilters, QAGasProfile } from '@cedar-all/core-data';

@Pipe({
  name: 'cylinderFilter'
})

export class CylinderFilterPipe implements PipeTransform {

  transform(cylinderList: Cylinder[], filterArgs: CylinderFilters, gasProfiles: QAGasProfile[] = []): Cylinder[] {
    let resultCylinders = [...cylinderList];
    let matchedCylIDs = [];

    if(cylinderList.length === 0 || !filterArgs) {
      return resultCylinders;
    }

    for(const filter in filterArgs) {
      const filterValue = filterArgs[filter];
      
      if(!filterValue.length) continue;

      switch(filter) {
        case('gasCodes'):
        // TODO add sort for gas code order
          filterValue.forEach(gas => {
            resultCylinders = resultCylinders.filter(c => c.epaGasTypeCodes.includes(gas))
          })
          break;
        case('unitNumber'):
          matchedCylIDs = [];
          gasProfiles.forEach(gasProfile => {
            if((gasProfile.unit.toString() === filterValue) && !matchedCylIDs.includes(gasProfile.cylID)) {
              matchedCylIDs.push(gasProfile.cylID);
            }
          })
          resultCylinders = resultCylinders.filter(c => matchedCylIDs.includes(c.cylinderID));
          break;
        case('cylinderID'):
          resultCylinders = resultCylinders.filter(c => c[filter] === filterValue);
          break;
        case('testType'):
          matchedCylIDs = [];
          gasProfiles.forEach(gasProfile => {
            if(gasProfile.desc.toLowerCase().includes(filterValue.toLowerCase()) && !matchedCylIDs.includes(gasProfile.cylID)) {
              matchedCylIDs.push(gasProfile.cylID);
            }
          })
          resultCylinders = resultCylinders.filter(c => matchedCylIDs.includes(c.cylinderID));
          break;
        default:
          break;
      }
    }
    
    return resultCylinders;
  }

  // sorter(array, order, key) {
  //   array.sort((a, b) => {
  //     var A = a[key], B = b[key];

  //     if (order.indexOf(A) > order.indexOf(B)) return 1;
  //     else return -1;
  //   });
    
  //   return array;
  // }
}
