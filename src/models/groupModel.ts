import mongoose from "mongoose";

const groupsSchema = new mongoose.Schema({
    host_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const Group = mongoose.models.groups || mongoose.model('groups', groupsSchema);

export default Group;