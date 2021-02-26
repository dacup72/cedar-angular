import { Pipe, PipeTransform } from '@angular/core';
import { QAGasProfile, GasProfileFilters } from '@cedar-all/core-data';


@Pipe({
  name: 'gasProfileFilter'
})
export class GasProfileFilterPipe implements PipeTransform {
  gasTypeOrder = ['NO', 'NO2', 'NOX', 'CO', 'O2', 'SO2', 'CO2', 'N2O', 'PPN', 'CH4', 'HE', 'H2S'];

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
          let newResultGasProfiles = [];
          filterValue.forEach(gas => {
            resultGasProfiles.forEach(profile => {
              if(profile.cedarGasCode.toLowerCase() === gas.toLowerCase()) {
                newResultGasProfiles.push(profile);
              }
            }) 
          })
          resultGasProfiles = newResultGasProfiles;
          break;
        case('unitNumber'):
          resultGasProfiles = resultGasProfiles.filter(g => g.unit.toString() === filterValue);
          break;
        case('testType'):
          resultGasProfiles = resultGasProfiles.filter(g => g.desc.toLowerCase().includes(filterValue.toLowerCase()));
          break;
        default:
          break;
      }
    }

    // Sort results by gas type code
    resultGasProfiles = this.sorter(resultGasProfiles, this.gasTypeOrder, 'cedarGasCode');
    
    return resultGasProfiles;
  }

  sorter(array, order, key) {
    array.sort((a, b) => {
      var A = a[key], B = b[key];

      if (order.indexOf(A) > order.indexOf(B)) return 1;
      else return -1;
    });
    
    return array;
  }
}
