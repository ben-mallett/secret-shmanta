import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  user_id: {
    type: String,
    ref: 'User',
    required: true
  },
  bio: String,
  links: [String],
  group_ids: [{
    type: String,
    ref: 'Group'
  }]
});

const Profile = mongoose.models.profiles || mongoose.model('profiles', profileSchema);

export default Profile