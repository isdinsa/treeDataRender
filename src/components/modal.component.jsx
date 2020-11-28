import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";

function listarComponentes(elem, handleLoadFile, handleClose) {

    try {
        const abc = elem.map((file, i) => {
            return (
              <ListGroup.Item action onClick={() => handleLoadFile(file, handleClose )}  key={i}>
                {file}
              </ListGroup.Item>
            );
          });
        
          return abc;
    }
    catch {
        console.log("Error en componente MyModal. Seguramente error de red");
    }
};

function MyModal(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  console.log("props.lista es: "+props.lista)
  const listado = listarComponentes(props.lista, props.handleLoadFile, handleClose);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Load session
      </Button>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>{listado}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MyModal;
