import { Pipe, PipeTransform } from '@angular/core';
import { Cylinder, CylinderFilters, QAGasProfile } from '@cedar-all/core-data';
import { parse } from 'querystring';

@Pipe({
  name: 'cylinderFilter'
})

export class CylinderFilterPipe implements PipeTransform {

  transform(cylinderList: Cylinder[], filterArgs: CylinderFilters, gasProfiles: QAGasProfile[] = []): Cylinder[] {
    let resultCylinders = [...cylinderList];
    let matchedCylIDs = [];
    let matchedGasProfileTagIDs = [];
    let cedarGasCodes = [];
    const analyzerSpanTypes = ['LOW', 'MID', 'HIGH'];
    
    gasProfiles.forEach(gasProfile => {
      if(!cedarGasCodes.includes(gasProfile.cedarGasCode)) {
        cedarGasCodes.push(gasProfile.cedarGasCode);
      }
    })

    if(cylinderList.length === 0 || !filterArgs) {
      return resultCylinders;
    }

    for(const filter in filterArgs) {
      const filterValue = filterArgs[filter];
      
      if(!filterValue.length) continue;

      switch(filter) {
        case('gasCodes'):
          // TODO add sort for gas code order
          if(filterValue.includes('_ACC_')) {
            // This is applied when using smart filter
            // Accumulating
            matchedCylIDs = [];
            filterValue.forEach(gas => {
              cylinderList.forEach(c => {
                if(c.epaGasTypeCodes.includes(gas) && !matchedCylIDs.includes(c.cylinderID)) {
                  matchedCylIDs.push(c.cylinderID);
                }
              })
            })
            resultCylinders = resultCylinders.filter(c => matchedCylIDs.includes(c.cylinderID));
          }
          else {
            // Filtering
            filterValue.forEach(gas => {
              resultCylinders = resultCylinders.filter(c => c.epaGasTypeCodes.includes(gas))
            })
          }
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
        
        case('state'):
          console.log(filterValue)
          resultCylinders = resultCylinders.filter(c => c[filter] === filterValue);
          break;

        case('testType'):
          // Filtering
          filterValue.forEach(item => {
            matchedCylIDs = [];

            if(analyzerSpanTypes.includes(item)) {
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
          })


          // // Accumulating
          // matchedCylIDs = [];
          // filterValue.forEach(item => {
          //   if(analyzerSpanTypes.includes(item)) {
          //     gasProfiles.forEach(gasProfile => {
          //       if(gasProfile.analyzerSpanType === item && !matchedCylIDs.includes(gasProfile.cylID)) {
          //         matchedCylIDs.push(gasProfile.cylID);
          //       }
          //     })
          //   }
          //   else if(cedarGasCodes.includes(item)) {
          //     gasProfiles.forEach(gasProfile => {
          //       if(gasProfile.cedarGasCode === item && !matchedCylIDs.includes(gasProfile.cylID)) {
          //         matchedCylIDs.push(gasProfile.cylID);
          //       }
          //     })
          //   }
          //   else {
          //     gasProfiles.forEach(gasProfile => {
          //       if(gasProfile.desc.toLowerCase().indexOf(item.toLowerCase()) !== -1 && !matchedCylIDs.includes(gasProfile.cylID)) {
          //         matchedCylIDs.push(gasProfile.cylID);
          //       }
          //     })
          //   }
          // })
          // resultCylinders = resultCylinders.filter(c => matchedCylIDs.includes(c.cylinderID));
          break;

        case('unitIDs'):
          // Filtering
          filterValue.forEach(id => {
            matchedCylIDs = [];
            gasProfiles.forEach(gasProfile => {
              if(gasProfile.unit.toString() === id && !matchedCylIDs.includes(gasProfile.cylID)) {
                matchedCylIDs.push(gasProfile.cylID);
              }
            })
            resultCylinders = resultCylinders.filter(c => matchedCylIDs.includes(c.cylinderID));
          })

          // // Accumulating
          // matchedCylIDs = [];
          // gasProfiles.forEach(gasProfile => {
          //   if(filterValue.includes(gasProfile.unit.toString()) && !matchedCylIDs.includes(gasProfile.cylID)) {
          //     matchedCylIDs.push(gasProfile.cylID);
          //   }
          // })
          // resultCylinders = resultCylinders.filter(c => matchedCylIDs.includes(c.cylinderID));
          break;

        case('concentration'):
          // Clicked Gas Profile
          if(filterValue[0].cedarGasCode) {
            matchedCylIDs = [];
            resultCylinders.forEach(c => {
              c.componentGases.forEach(g => {
                // Compare gas concentrations
                const min = parseInt(filterValue[0].allowableGasValueMin) 
                const max = parseInt(filterValue[0].allowableGasValueMax) 
                const min2 = parseInt(filterValue[0].allowableGasValueMin2) 
                const max2 = parseInt(filterValue[0].allowableGasValueMax2) 
                const filteredGas = filterValue[0].cedarGasCode;

                let validConc = false;
                c.componentGases.forEach(componentGas => {
                  const conc = componentGas.gasConcentration;
                  if(min2 && max2 && componentGas.epaGasCode === filteredGas) {
                    if((conc > min && conc < max) || (conc > min2 && conc < max2)) {
                      validConc = true;
                    }
                  }
                  else if(componentGas.epaGasCode === filteredGas) {
                    if((conc > min && conc < max)) {
                      validConc = true;
                    }
                  }
                })
                if(validConc) {
                  matchedCylIDs.push(c.cylinderID);
                }
              })
            })
            resultCylinders = resultCylinders.filter(c => matchedCylIDs.includes(c.cylinderID));
          }
          // Clicked Cylinder
          else {
            matchedCylIDs = [];
            filterValue.forEach(componentGas => {
              gasProfiles.forEach(g => {
                let validConc = false;
                if(componentGas.epaGasCode === g.cedarGasCode) {
                  const min = parseInt(g.allowableGasValueMin) 
                  const max = parseInt(g.allowableGasValueMax) 
                  const min2 = parseInt(g.allowableGasValueMin2) 
                  const max2 = parseInt(g.allowableGasValueMax2)
                  const conc = componentGas.gasConcentration;
                  
                  if(min2 && max2) {
                    if((conc > min && conc < max) || (conc > min2 && conc < max2)) {
                      validConc = true;
                    }
                  }
                  else if((conc > min && conc < max)){
                    validConc = true;
                  }
                }
                if(validConc && !matchedCylIDs.includes(g.cylID)) matchedCylIDs.push(g.cylID);
              })
            })
            resultCylinders = resultCylinders.filter(c => matchedCylIDs.includes(c.cylinderID));
          }
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
