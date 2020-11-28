import React from 'react';


export const OptionFeatures = props =>{
    //props.grupos
    let featureIds = props.featureIds;
    //featureIds = ["-"].concat(featureIds);
    let options = featureIds.map((featureId, ind) => {
        return (
          <option key={ind} value={featureId} >
            {featureId}
          </option>
        );
      });
      //const default  = <option key={10} value={" "} > {" "} </option>
    //options = default.concat(options);
    return( 
        <select value={props.selectedFid} onChange={props.onChange}>
                {options}
        </select>
        );
}