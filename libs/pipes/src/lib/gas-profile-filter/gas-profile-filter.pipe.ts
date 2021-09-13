import { Pipe, PipeTransform } from '@angular/core';
import { QAGasProfile, GasProfileFilters } from '@cedar-all/core-data';
import { cloneDeep as _cloneDeep } from 'lodash';


@Pipe({
  name: 'gasProfileFilter'
})
export class GasProfileFilterPipe implements PipeTransform {
  gasTypeOrder = ['NO', 'NO2', 'NOX', 'CO', 'O2', 'SO2', 'CO2', 'N2O', 'PPN', 'CH4', 'HE', 'H2S'];
  analyzerSpanTypes = ['LOW', 'MID', 'HIGH'];

  transform(gasProfiles: QAGasProfile[], filterArgs: GasProfileFilters): QAGasProfile[] {
    let resultGasProfiles = [...gasProfiles];

    if(gasProfiles.length === 0 || !filterArgs) {
      return resultGasProfiles;
    }

    for(const filter in filterArgs) {
      let filterValue = _cloneDeep(filterArgs[filter]);
      if(!filterValue.length) continue;

      switch(filter) {
        case('gasCodes'):
        

          // If filterValue contains 'NOX' then ensure 'NO' and 'NO2' are also filtered for
          if(filterValue.includes('NOX')) {
            if(!filterValue.includes('NO')) filterValue.push('NO');
            if(!filterValue.includes('NO2')) filterValue.push('NO2');
          }

          // Accumulating Filter
          resultGasProfiles = resultGasProfiles.filter(gasProfile => 
            filterValue.filter(gas => 
              gasProfile.cedarGasCode === gas
            ).length > 0
          );
          break;

        case('testType'):
          let cedarGasCodes = [];
      
          gasProfiles.forEach(gasProfile => {
            if(!cedarGasCodes.includes(gasProfile.cedarGasCode)) {
              cedarGasCodes.push(gasProfile.cedarGasCode);
            }
          })

          // Normal Filtering
          filterValue.forEach(item => {
            if(this.analyzerSpanTypes.includes(item)) {
              resultGasProfiles = resultGasProfiles.filter(g => g.analyzerSpanType === item);
            }
            else if(cedarGasCodes.includes(item)) {
              resultGasProfiles = resultGasProfiles.filter(g => g.cedarGasCode === item);
            }
            else {
              resultGasProfiles = resultGasProfiles.filter(g => g.desc.toLowerCase().indexOf(item.toLowerCase()) !== -1);
            }
          })          
          break;

        case('unitIDs'):
          // Accumulating Filtering
          resultGasProfiles = resultGasProfiles.filter(gasProfile =>
            filterValue.includes(gasProfile.unit)
          );
          break;

        case('singleConcentrations'):
          // Accumulating Filter
          resultGasProfiles = resultGasProfiles.filter(gasProfile => 
            filterValue.filter(conc => {
              let valid = false;
              const min1 = parseInt(gasProfile.allowableGasValueMin);
              const max1 = parseInt(gasProfile.allowableGasValueMax);
              const min2 = parseInt(gasProfile.allowableGasValueMin2);
              const max2 = parseInt(gasProfile.allowableGasValueMax2);
              const gasConc = conc.concentration ? parseInt(conc.concentration) : min1;
              const uom = conc.uom ? conc.uom : gasProfile.uom;
              // let concGasCode = conc.cedarGasCode;
              // if(gasProfile.cedarGasCode === 'NOX' && (concGasCode === 'NO' || concGasCode === 'NO2')) {
              //   concGasCode = gasProfile.cedarGasCode;
              // }
              let gasCode = gasProfile.cedarGasCode;
              if(conc.cedarGasCode === 'NOX' && (gasCode === 'NO' || gasCode === 'NO2')) {
                gasCode = conc.cedarGasCode;
              }

              valid = conc.cedarGasCode === gasCode
                && min1 <= gasConc
                && max1 >= gasConc
                && gasProfile.uom === uom;
              if(min2 && max2 && !valid) {
                valid = conc.cedarGasCode === gasCode
                  && min2 <= gasConc
                  && max2 >= gasConc
                  && gasProfile.uom === uom;
              }
              return valid;
            }).length > 0
          );  
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
