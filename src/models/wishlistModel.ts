import mongoose from "mongoose";
import { giftSchema } from "./giftSchema";

const wishlistSchema = new mongoose.Schema({
  user_id: {
    type: String,
    ref: 'User',
    required: true
  },
  gifts: {
    type: [String],
    required: true
  },
}, { timestamps: true });

const Wishlist = mongoose.models.wishlists || mongoose.model('wishlists', wishlistSchema);

export default Wishlist;