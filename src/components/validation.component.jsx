import React from 'react';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'


const Validation = props => {

      return (
        <ToggleButtonGroup type="checkbox" value={1}>
            <ToggleButton variant="warning" value={1}>Validar config. paso a paso</ToggleButton>
            <ToggleButton variant="warning" value={2}>Validar config. final</ToggleButton>
        </ToggleButtonGroup>
      )
  }
  
  
  export default Validation;