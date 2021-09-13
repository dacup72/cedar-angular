import { Pipe, PipeTransform } from '@angular/core';
import { Cylinder, CylinderFilters, QAGasProfile } from '@cedar-all/core-data';
import { 
  filter as _filter,
  cloneDeep as _cloneDeep 
} from 'lodash';

@Pipe({
  name: 'cylinderFilter'
})

export class CylinderFilterPipe implements PipeTransform {
  analyzerSpanTypes = ['LOW', 'MID', 'HIGH'];

  transform(cylinderList: Cylinder[], filterArgs: CylinderFilters, gasProfiles: QAGasProfile[] = []): Cylinder[] {
    let resultCylinders = [...cylinderList];

    if(cylinderList.length === 0 || !filterArgs) {
      return resultCylinders;
    }

    for(const filter in filterArgs) {
      let filterValue = _cloneDeep(filterArgs[filter]);
      if(!filterValue.length) continue;

      switch(filter) {
        case('gasCodes'):
          // If filterValue contains 'NOX' then ensure 'NO' and 'NO2' are also filtered for and vice versa
          const includesNOX = filterValue.includes('NOX');
          const includesNO2OrNO = filterValue.includes('NO') || filterValue.includes('NO2');
          if(includesNOX) {
            if(!filterValue.includes('NO')) filterValue.push('NO');
            if(!filterValue.includes('NO2')) filterValue.push('NO2');
          }
          else if(includesNO2OrNO) {
            if(!filterValue.includes('NOX')) filterValue.push('NOX');
          }

          resultCylinders = resultCylinders.filter(cyl => {
            if(includesNOX || includesNO2OrNO) {
             return filterValue.filter(gas => 
                cyl.componentGases.filter(cylGas => 
                  cylGas.epaGasCode === gas
                ).length > 0
              ).length > 0
            }
            else {
              return filterValue.filter(gas => 
                cyl.componentGases.filter(cylGas => 
                  cylGas.epaGasCode === gas
                ).length > 0
              ).length === filterValue.length
            }
          });
          break;

        case('testType'):
          let cedarGasCodes = [];
          
          gasProfiles.forEach(gasProfile => {
            if(!cedarGasCodes.includes(gasProfile.cedarGasCode)) {
              cedarGasCodes.push(gasProfile.cedarGasCode);
            }
          })

          filterValue.forEach(item => {
            let matchedCylIDs = [];

            if(this.analyzerSpanTypes.includes(item)) {
              gasProfiles.forEach(gasProfile => {
                if(gasProfile.analyzerSpanType === item && !matchedCylIDs.includes(gasProfile.cylID)) {
                  matchedCylIDs.push(gasProfile.cylID);
                }
              })
              resultCylinders = resultCylinders.filter(cylinder => matchedCylIDs.includes(cylinder.cylinderID));
            }
            else if(cedarGasCodes.includes(item)) {
              gasProfiles.forEach(gasProfile => {
                if(gasProfile.cedarGasCode === item && !matchedCylIDs.includes(gasProfile.cylID)) {
                  matchedCylIDs.push(gasProfile.cylID);                }
              })
              resultCylinders = resultCylinders.filter(cylinder => matchedCylIDs.includes(cylinder.cylinderID));
            }
            else {
              gasProfiles.forEach(gasProfile => {
                if(gasProfile.desc.toLowerCase().indexOf(item.toLowerCase()) !== -1 && !matchedCylIDs.includes(gasProfile.cylID)) {
                  matchedCylIDs.push(gasProfile.cylID); 
                }
              })
              resultCylinders = resultCylinders.filter(cylinder => matchedCylIDs.includes(cylinder.cylinderID));
            }
          });
          break;

        case('unitIDs'):
          resultCylinders = resultCylinders.filter(cyl =>
            filterValue.filter(unit => 
              gasProfiles.filter(gas => 
                gas.unit === unit
                && gas.cylID === cyl.cylinderID
              ).length > 0
            ).length === filterValue.length
          );
          break;

        case('concentrations'):
          filterValue.forEach(conc => {
            if(conc.cedarGasCode === 'NOX') {
              let noConc = _cloneDeep(conc);
              let no2Conc = _cloneDeep(conc);
              noConc.cedarGasCode = 'NO';
              no2Conc.cedarGasCode = 'NO2';
              filterValue.push(noConc);
              filterValue.push(no2Conc);
            }
            else if(conc.cedarGasCode === 'NO' || conc.cedarGasCode === 'NO2') {
              let noxConc = _cloneDeep(conc);
              noxConc.cedarGasCode = 'NOX';
              filterValue.push(noxConc);
            }
          })
          
          // Filtering from assigned panel to available panel
          if(!gasProfiles.length) {
            resultCylinders = resultCylinders.filter(cyl => 
              cyl.componentGases.filter(gas => 
                filterValue.filter(conc => {
                  const min = conc.allowableGasValueMin ? parseInt(conc.allowableGasValueMin) : 0;
                  const max = conc.allowableGasValueMax ? parseInt(conc.allowableGasValueMax) : Infinity;
                  const uom = conc.uom ? conc.uom : gas.uom;

                  return (conc.cedarGasCode === gas.epaGasCode || conc.cedarGasCode === gas.qaGasDefCode)
                  && min <= gas.gasConcentration
                  && max >= gas.gasConcentration
                  && uom === gas.uom
                }).length > 0
              ).length > 0
            );
          }
          // Filtering from available panel to assigned panel
          else {
            resultCylinders = resultCylinders.filter(cyl => {
              const matchedGasProfiles = gasProfiles.filter(g => g.cylID === cyl.cylinderID);
              return matchedGasProfiles.filter(gas => 
                filterValue.filter(cylGas => {
                  let valid = false;
                  const min1 = parseInt(gas.allowableGasValueMin);
                  const max1 = parseInt(gas.allowableGasValueMax);
                  const min2 = parseInt(gas.allowableGasValueMin2);
                  const max2 = parseInt(gas.allowableGasValueMax2);
                  const conc = parseInt(cylGas.concentration);

                  valid = gas.cedarGasCode === cylGas.cedarGasCode
                    && min1 <= conc
                    && max1 >= conc
                    && gas.uom === cylGas.uom;
                  if(min2 && max2 && !valid) {
                    valid = gas.cedarGasCode === cylGas.cedarGasCode
                      && min2 <= conc 
                      && max2 >= conc
                      && gas.uom === cylGas.uom;
                  }
                  return valid;
                }).length > 0
              ).length > 0
            });
          }
          break;

        case('singleConcentrations'):
          // Remove any blank single concentrations
          filterValue = filterValue.filter(conc => conc.concentration);
          if(!filterValue.length) break;

          resultCylinders = resultCylinders.filter(cyl => {
            const matchedGasProfiles = gasProfiles.filter(g => g.cylID === cyl.cylinderID);
            const matchedGasProfilesLength = matchedGasProfiles.filter(profile => 
              filterValue.filter(cylGas => 
                profile.cedarGasCode === cylGas.cedarGasCode
              ).length > 0
            ).length;

            return matchedGasProfiles.filter(gas => 
              filterValue.filter(cylGas => {
                let valid = false;
                const min1 = parseInt(gas.allowableGasValueMin);
                const max1 = parseInt(gas.allowableGasValueMax);
                const min2 = parseInt(gas.allowableGasValueMin2);
                const max2 = parseInt(gas.allowableGasValueMax2);
                const conc = parseInt(cylGas.concentration);
                const uom = cylGas.uom ? cylGas.uom : gas.uom;
                let gasCode = gas.cedarGasCode;
                if(cylGas.cedarGasCode === 'NOX' && (gasCode === 'NO' || gasCode === 'NO2')) {
                  gasCode = cylGas.cedarGasCode;
                }

                valid = gasCode === cylGas.cedarGasCode
                  && min1 <= conc
                  && max1 >= conc
                  && gas.uom === uom;
                if(min2 && max2 && !valid) {
                  valid = gasCode === cylGas.cedarGasCode
                    && min2 <= conc 
                    && max2 >= conc
                    && gas.uom === uom;
                }
                // TODO: Investigate this further
                // I have no idea why returning the not valid works when gas.cedarGasCode = 'NO' or 'NO2'
                // 'NO' and 'NO2' are somehow passing when valid = false and failing when valid = true
                return (gas.cedarGasCode === 'NO') || (gas.cedarGasCode === 'NO2') ? !valid : valid;
              }).length > 0
            ).length === matchedGasProfilesLength
          });
          break;
        
        case('cylinderID'):
          resultCylinders = resultCylinders.filter(c => c[filter] === filterValue);
          break;

        case('state'):
          resultCylinders = resultCylinders.filter(c => c[filter] === filterValue);
          break;

        default:
          break;
      }
    }

    return resultCylinders;
  }
}
