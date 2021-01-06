import { Pipe, PipeTransform } from '@angular/core';
import { Cylinder, CylinderFilters, QAGasProfile } from '@cedar-all/core-data';

@Pipe({
  name: 'cylinderFilter'
})

export class CylinderFilterPipe implements PipeTransform {

  transform(cylinderList: Cylinder[], filterArgs: CylinderFilters, gasProfiles: QAGasProfile[] = []): Cylinder[] {
    let resultCylinders = [...cylinderList];

    if(cylinderList.length === 0 || !filterArgs) {
      return resultCylinders;
    }

    for(const filter in filterArgs) {
      const filterValue = filterArgs[filter];
      
      if(!filterValue.length) continue;

      switch(filter) {
        case('gasCodes'):
          filterValue.forEach(gas => {
            resultCylinders = resultCylinders.filter(c => c.epaGasTypeCodes.includes(gas))
          })
          break;
        case('unitNumber'):
          resultCylinders = []
          const filteredGasProfiles = gasProfiles.filter(g => g.unit.toString() === filterValue);

          filteredGasProfiles.forEach(g => {
            cylinderList.forEach(c => {
              if(c.cylinderID === g.cylID && !resultCylinders.includes(c)) {
                resultCylinders.push(c);
              }
            })
          })
          break;
        case('cylinderID'):
          resultCylinders = resultCylinders.filter(c => c[filter] === filterValue);
          break;
        default:
          break;
      }
    }
    
    return resultCylinders;
  }
}
