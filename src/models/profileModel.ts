import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bio: String,
  links: [String],
  group_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  }]
});

const Profile = mongoose.models.profiles || mongoose.model('profiles', profileSchema);

export default Profile