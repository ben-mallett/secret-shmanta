import mongoose from "mongoose";

const giftSchema = new mongoose.Schema({
  giver_id: {
    type: String,
    ref: 'User',
    required: true
  },
  recipient_id: {
    type: String,
    ref: 'User',
    required: true
  },
  product_id: {
    type: String,
    required: true
  },
  description: String,
  group_id: {
    type: String,
    ref: 'Group',
    required: true // Marked as required
  }
}, { timestamps: true });

const Gift = mongoose.models.gifts || mongoose.model('gift', giftSchema);

export default Gift;