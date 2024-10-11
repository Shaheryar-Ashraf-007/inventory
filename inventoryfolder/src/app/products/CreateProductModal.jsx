import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/material';

const CreatePurchaseModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [rating, setRating] = useState('');

  const handleSubmit = () => {
    if (!name || !stockQuantity || !price) {
      alert("Product Name, Stock Quantity, and Unit Cost are required!");
      return;
    }

    const parsedStockQuantity = parseInt(stockQuantity, 10);
    const parsedPrice = parseFloat(price);
    const parsedRating = rating ? parseFloat(rating) : undefined; // Optional rating

    onCreate({ name, stockQuantity: parsedStockQuantity, price: parsedPrice, rating: parsedRating });

    // Reset fields
    setName('');
    setStockQuantity('');
    setPrice('');
    setRating('');
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
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
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Create New Product</h2>
        
        <TextField
          label="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
          margin="normal"
          variant="outlined"
          sx={{ bgcolor: 'white' }}
        />
        
        <TextField
          label="Stock Quantity"
          type="number"
          value={stockQuantity}
          onChange={(e) => setStockQuantity(e.target.value)}
          required
          fullWidth
          margin="normal"
          variant="outlined"
          sx={{ bgcolor: 'white' }}
        />
        
        <TextField
          label="Unit Cost"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          fullWidth
          margin="normal"
          variant="outlined"
          sx={{ bgcolor: 'white' }}
        />

        <TextField
          label="Rating (Optional)"
          type="number"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
          sx={{ bgcolor: 'white' }}
          inputProps={{ min: 0, max: 5, step: 0.1 }} // Optional ratings range
        />
        
        <div className="flex justify-end mt-4">
          <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ mr: 1 }}>
            Create
          </Button>
          <Button onClick={onClose} variant="outlined" color="secondary">
            Cancel
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default CreatePurchaseModal;