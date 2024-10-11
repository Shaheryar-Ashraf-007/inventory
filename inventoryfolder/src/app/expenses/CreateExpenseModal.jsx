import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/material';

const CreateExpenseModal = ({ open, onClose, onCreate }) => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = () => {
    if (!category || !amount) {
      alert("Both category and amount are required!");
      return;
    }

    onCreate({ category, amount: parseFloat(amount) });
    setCategory('');
    setAmount('');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'relative',
          bgcolor: 'background.paper',
          borderRadius: '8px',
          boxShadow: 24,
          p: 4,
          m: 'auto',
          width: '90%',
          maxWidth: 400,
          outline: 'none',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Create New Expense</h2>
        <TextField
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          fullWidth
          margin="normal"
          variant="outlined"
          sx={{ bgcolor: 'white' }}
        />
        <TextField
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          fullWidth
          margin="normal"
          variant="outlined"
          sx={{ bgcolor: 'white' }}
        />
        <div className="flex justify-end mt-4">
          <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ mr: 1 }}>
            Submit
          </Button>
          <Button onClick={onClose} variant="outlined" color="secondary">
            Cancel
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default CreateExpenseModal;