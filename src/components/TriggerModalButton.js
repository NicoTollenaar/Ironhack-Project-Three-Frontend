function TriggerModalButton({ showModal, changeShowModal }) {
  console.log(
    "In showmodal, logging props showModal and changeShowModal :",
    showModal,
    changeShowModal
  );
  return (
    <button
      className="btn btn-primary btn-sm"
      type="button"
      onClick={() => changeShowModal()}
    >
      Move funds on-chain
    </button>
  );
}

export default TriggerModalButton;
