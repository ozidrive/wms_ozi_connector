import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import ordersRouter from './routes/orders';
import productsRouter from './routes/products';
import inventoryRouter from './routes/inventory';
import returnsRouter from './routes/returns';
import authRouter from './routes/auth';

const app = express();
app.use(express.json());

app.use('/orders', ordersRouter);
app.use('/products', productsRouter);
app.use('/inventory', inventoryRouter);
app.use('/returns', returnsRouter);
app.use('/auth', authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
