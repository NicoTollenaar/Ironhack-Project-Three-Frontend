import { useState } from "react";
import MoveFundsModal from "./MoveFundsModal";
import TriggerModalButton from "./TriggerModalButton";

function ModalContainer() {
  const [showModal, setShowModal] = useState(false);

  function changeShowModal() {
    //   showModal ? setShowModal(false) : setShowModal(true);
    setShowModal(true);
  }

  return (
    <>
      <TriggerModalButton
        showModal={showModal}
        changeShowModal={changeShowModal}
      />
      {showModal && <MoveFundsModal />}
    </>
  );
}

export default ModalContainer;
