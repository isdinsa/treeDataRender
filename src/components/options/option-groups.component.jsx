import React from 'react';

export const OptionGroups = props => {
    //props.grupos
    const groups=props.groups;
    
    const options = groups.map((group, ind) => {
        return (
          <option key={ind} value={group}>
            {group.charAt(0).toUpperCase()+group.slice(1, group.length)}
          </option>
        );
      });
  
    return( 
      <select value={props.selectedGid} onChange={props.onChange}>
              {options}
       </select>
      );
    }