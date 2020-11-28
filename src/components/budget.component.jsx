import React from 'react';
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'


const Budget = React.forwardRef((props, ref) => {
        return(  
        <InputGroup className="mb-3">
            <InputGroup.Prepend>
                <InputGroup.Text>Presupuesto ($)</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl ref={this.textInput} type="text" onChange={() => this.handleChange()} />
        </InputGroup>
        )
});


export default Budget;
