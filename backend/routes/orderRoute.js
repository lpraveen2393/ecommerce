import express from 'express'
import { placeOrder, placeOrderStripe, allOrders, userOrders, updateStatus, verifyStripe } from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'
const orderRouter = express.Router();

//Admin features 

orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

// Payment features

orderRouter.post('/place', authUser, placeOrder);//for COD 
orderRouter.post('/stripe', authUser, placeOrderStripe);


//User feature
orderRouter.post('/userorders', authUser, userOrders);

//verify payment

orderRouter.post('/verifystripe', authUser, verifyStripe)
export default orderRouter;



