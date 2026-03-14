import mongoose from 'mongoose';

const stockLedgerSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  changeAmount: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const StockLedger = mongoose.model('StockLedger', stockLedgerSchema);

export default StockLedger;
