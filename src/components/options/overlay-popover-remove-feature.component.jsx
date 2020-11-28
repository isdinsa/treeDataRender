import React from 'react';
import Popover from 'react-bootstrap/Popover'
import Button from 'react-bootstrap/Button'
//import Button from "@material-ui/core/Button";
import 'bootstrap/dist/css/bootstrap.min.css';

import Appi from '../../App2'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'


export const OverlayPopoverRemoveFeature = props => {

    const popover = (
        <Popover id="popover-basic">
          <Popover.Content>
            {<Appi handleRemoveFeature={(fid) =>  props.handleRemoveFeature(fid)}
            accion="removeFeature"
            featureList={props.featureList}
            />

            }
          </Popover.Content>
        </Popover>
      );

      
    return (
      <span className="overlay-remove-feature">
        <OverlayTrigger trigger="click" placement="top" overlay={popover} rootClose>
          <Button variant="outline-primary">Eliminar característica</Button>
        </OverlayTrigger>
        </span>
    )
}