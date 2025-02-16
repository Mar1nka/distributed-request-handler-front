import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import * as React from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

type CreateResourceModalProps = {
  isOpen: boolean;
  handleClose: () => void;
  handleSubmitForm: (url: string) => void;
};

export default function CreateResourceModal({isOpen, handleClose, handleSubmitForm}: CreateResourceModalProps) {
  const [urlValue, setUrlValue] = useState('');

  const handleUrlValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrlValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUrlValue('');
    handleSubmitForm(urlValue);
    handleClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ marginBottom: "10px" }}>
          Create new resource
        </Typography>
        <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
          <TextField
            label="Url"
            variant="outlined"
            value={urlValue}
            onChange={handleUrlValueChange}
            required
            size="small"
          />
          <div className="button-container">
            <Button type="button" onClick={handleClose} variant="outlined">Cancel</Button>
            <Button type="submit" variant="contained" color="primary">Submit</Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
}
