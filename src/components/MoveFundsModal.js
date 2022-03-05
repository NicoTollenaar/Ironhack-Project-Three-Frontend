import axios from "axios";
import { useState, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ModalForm from "./ModalForm";
import { useNavigate } from "react-router-dom";
import { BackendUrlContext } from "../context/backendUrl.context";
import { CurrentAccountholderContext } from "../context/currentAccountholder.context";

function MoveFundsModal(props) {
  const { currentAccountholder, changeCurrentAccountholder } = useContext(
    CurrentAccountholderContext
  );

  return (
    <>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Move funds on-chain
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4 className="my-3">
            Accountholder {currentAccountholder.firstName}
          </h4>
          <h5>From off-chain account:</h5>
          <p>{currentAccountholder.offChainAccount.address}</p>
          <br />
          <h5>To on-chain account:</h5>
          <p>ETHAddress: {currentAccountholder.onChainAccount.address}</p>
          <br />
          <ModalForm />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MoveFundsModal;
