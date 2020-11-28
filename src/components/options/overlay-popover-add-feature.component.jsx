import React from 'react';
import Popover from 'react-bootstrap/Popover'
import Button from 'react-bootstrap/Button'
//import Button from "@material-ui/core/Button";
import 'bootstrap/dist/css/bootstrap.min.css';

import Appi from '../../App2'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'


export const OverlayPopoverAddFeature = props => {
  console.log('featureList...',props.featureList);
  console.log('groupList...',props.groupList);
    const popover = (
        <Popover id="popover-basic">
          <Popover.Content>
            {
            <Appi handleAddFeature={(fid, gid, type, cost) =>  props.handleAddFeature(fid, gid, type, cost)}
            accion="addFeature"
            featureList={props.featureList}
            groupList={props.groupList}
            />
            }
          </Popover.Content>
        </Popover>
      );

      
      
    return (
      <span className="overlay-add-feature">
        <OverlayTrigger trigger="click" placement="top" overlay={popover} rootClose>
          <Button variant="primary">Añadir característica</Button>
        </OverlayTrigger>
        </span>
    )

}