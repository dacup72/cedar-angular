import { Pipe, PipeTransform } from '@angular/core';
import { QAGasProfile, GasProfileFilters } from '@cedar-all/core-data';


@Pipe({
  name: 'gasProfileFilter'
})
export class GasProfileFilterPipe implements PipeTransform {

  transform(gasProfiles: QAGasProfile[], filterArgs: GasProfileFilters): QAGasProfile[] {
    let resultGasProfiles = [...gasProfiles];

    if(gasProfiles.length === 0 || !filterArgs) {
      return resultGasProfiles;
    }

    for(const filter in filterArgs) {
      const filterValue = filterArgs[filter];

      if(!filterValue.length) continue;

      switch(filter) {
        case('gasCodes'):
          resultGasProfiles = [];
          filterValue.forEach(gas => {
            //resultGasProfiles = resultGasProfiles.filter(g => g.cedarGasCode === gas);
            gasProfiles.forEach(profile => {
              if(profile.cedarGasCode === gas) {
                resultGasProfiles.push(profile);
              }
            })
          })
          break;
        case('unitNumber'):
          resultGasProfiles = resultGasProfiles.filter(g => g.unit.toString() === filterValue);
          break;
        default:
          break;
      }
    }
    
    return resultGasProfiles;
  }
}
