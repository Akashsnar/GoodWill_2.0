// DeleteConfirmation.js
import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const DeleteConfirmation = ({ open, onClose, onConfirm }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-delete-modal"
      aria-describedby="confirm-delete-modal-description"
    >
      <Box className="confirm-delete-modal-container">
        <h2 id="confirm-delete-modal">Confirm Delete</h2>
        <p id="confirm-delete-modal-description">
          Are you sure you want to delete this item?
        </p>
        <div className="button-container">
          <Button className="confirm-button" onClick={onConfirm}>
            <i class="fa fa-check" aria-hidden="true"></i>&nbsp;Yes
          </Button>
          <Button className="cancel-button" onClick={onClose}>
            <i class="fa fa-times" aria-hidden="true"></i>&nbsp;No
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default DeleteConfirmation;
