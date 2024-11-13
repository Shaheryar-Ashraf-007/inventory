import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createProduct, deleteProduct, getProducts } from './controllers/productController.js';
import { createSalaries, deleteSalaries, getSalaries } from './controllers/salariesController.js';
import { createUsers, deleteUsers, getUsers } from './controllers/userController.js';
import { createExpense, deleteExpense, getExpensesByCategory } from './controllers/expenseController.js';
import { getDashboardMetrics } from './controllers/dashboardController.js';


dotenv.config();

const app = express();
const port = Number(process.env.PORT)||80;

app.listen(port, "0.0.0.0",() => {
  console.log(`Server running on http://localhost:${port}`);
});

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.get('/dashboard', getDashboardMetrics); //http://localhost:8000/dashboard
app.get('/products',getProducts);  //http://localhost:8000/products
app.post('/products',createProduct);
app.delete('/products/:productId', deleteProduct);
app.get('/salaries', getSalaries); 
app.post('/salaries', createSalaries);
app.delete('/salaries/:userId', deleteSalaries);
app.get('/expenses',getExpensesByCategory);
app.post('/expenses', createExpense);
app.delete('/expenses/:expenseId', deleteExpense);
app.get('/users',getUsers);
app.post('/users', createUsers); 
app.delete('/users/:userId', deleteUsers)
; 

app.get('/', (req, res) => {
  res.send('Inventory Management System API');
});

