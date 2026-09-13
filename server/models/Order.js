import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, default: 1 }
        }
    ],
    totalAmount: { type: Number, required: true },
    orderId: { type: String, required: true }, 
    paymentId: { type: String }, 
    status: { type: String, enum: ['Created', 'Paid', 'Failed'], default: 'Created' } 
}, { timestamps: true });

export default mongoose.model('Order', OrderSchema);