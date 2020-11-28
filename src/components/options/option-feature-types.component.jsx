import React from 'react';

const featureTypes = ["mandatory", "optional"];

export const OptionFeatureTypes = props =>{
  
    const options = featureTypes.map((feature, ind) => {
        return (
          <option key={ind} value={feature}>
            {feature.charAt(0).toUpperCase()+feature.slice(1, feature.length)}
          </option>
        );
      });
  
    return( 
      <select  value={props.selectedFeatureTypes} onChange={props.onChange}>
              {options}
       </select>
      );
  }