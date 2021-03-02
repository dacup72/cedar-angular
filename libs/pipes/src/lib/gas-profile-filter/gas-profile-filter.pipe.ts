import { Pipe, PipeTransform } from '@angular/core';
import { QAGasProfile, GasProfileFilters } from '@cedar-all/core-data';


@Pipe({
  name: 'gasProfileFilter'
})
export class GasProfileFilterPipe implements PipeTransform {
  gasTypeOrder = ['NO', 'NO2', 'NOX', 'CO', 'O2', 'SO2', 'CO2', 'N2O', 'PPN', 'CH4', 'HE', 'H2S'];

  transform(gasProfiles: QAGasProfile[], filterArgs: GasProfileFilters): QAGasProfile[] {
    let resultGasProfiles = [...gasProfiles];
    let matchedGasProfileTagIDs = [];
    let cedarGasCodes = [];
    const analyzerSpanTypes = ['LOW', 'MID', 'HIGH'];
    
    gasProfiles.forEach(gasProfile => {
      if(!cedarGasCodes.includes(gasProfile.cedarGasCode)) {
        cedarGasCodes.push(gasProfile.cedarGasCode);
      }
    })

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
          // Filtering
          filterValue.forEach(item => {
            if(analyzerSpanTypes.includes(item)) {
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
          // Filtering
          filterValue.forEach(id => {
            resultGasProfiles = resultGasProfiles.filter(g => g.unit === id);
          })

          // // Accumulating
          // matchedGasProfileTagIDs = [];
          // gasProfiles.forEach(gasProfile => {
          //   if(filterValue.includes(gasProfile.unit)) {
          //     matchedGasProfileTagIDs.push(gasProfile.tagID);
          //   }
          // })
          // resultGasProfiles = resultGasProfiles.filter(g => matchedGasProfileTagIDs.includes(g.tagID));
          break;

        case('concentration'):
          matchedGasProfileTagIDs = []
          filterValue.forEach(componentGas => {
            const conc = componentGas.gasConcentration;
            resultGasProfiles.forEach(g => {
              const min = parseInt(g.allowableGasValueMin) 
              const max = parseInt(g.allowableGasValueMax) 
              const min2 = parseInt(g.allowableGasValueMin2) 
              const max2 = parseInt(g.allowableGasValueMax2)
              let validConc = false
              if(g.cedarGasCode === componentGas.epaGasCode) {
                if(min2 && max2) {
                  if((conc > min && conc < max) || (conc > min2 && conc < max2)) {
                    validConc = true;
                  }
                }
                else if((conc > min && conc < max)){
                  validConc = true;
                }
              }
              if(validConc) matchedGasProfileTagIDs.push(g.tagID);
            });
          })
          resultGasProfiles = resultGasProfiles.filter(g => matchedGasProfileTagIDs.includes(g.tagID));
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
