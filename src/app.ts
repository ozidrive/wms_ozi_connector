import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import { validateApiKey } from './middleware/apiKeyCheck';
import ordersRouter from './routes/orders';
import productsRouter from './routes/products';
import inventoryRouter from './routes/inventory';
import returnsRouter from './routes/returns';
import authRouter from './routes/auth';
import pidgeRouter from './routes/pidge';

const app = express();
app.use(express.json());
app.use(cors());
app.use(validateApiKey);

app.use('/orders', ordersRouter);
app.use('/products', productsRouter);
app.use('/inventory', inventoryRouter);
app.use('/returns', returnsRouter);
app.use('/auth', authRouter);
app.use('/pidge', pidgeRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
