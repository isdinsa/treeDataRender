import React from 'react';


const groupTypes = ["AND", "OR", "ALTERNATIVE"];

export const OptionGroupTypes = props => {
    
        const options = groupTypes.map((grouptype, ind) => {
            return (
            <option key={ind} value={grouptype}>
                {grouptype}
            </option>
            );
        });
    
        return( 
        <select value={props.selectedGroupType} onChange={props.onChange}>
                {options}
        </select>
        );
    
}