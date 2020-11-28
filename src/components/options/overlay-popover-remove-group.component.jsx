import React from 'react';
import Popover from 'react-bootstrap/Popover'
import Button from 'react-bootstrap/Button'
//import Button from "@material-ui/core/Button";
import 'bootstrap/dist/css/bootstrap.min.css';


import Appi from '../../App2'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'


export const OverlayPopoverRemoveGroup = props => {

    const popover = (
        <Popover id="popover-basic">
          <Popover.Content>
            {<Appi handleRemoveGroup={(gid) =>  props.handleRemoveGroup(gid)}
            accion="removeGroup"
            groupList={props.groupList}
            />}
          </Popover.Content>
        </Popover>
      );

     
    return (
      <span className="overlay-add-group">
        <OverlayTrigger trigger="click" placement="top" overlay={popover} rootClose>
        <Button variant="outline-secondary">Eliminar grupo</Button>
        </OverlayTrigger>
      </span>
    )

}