import mongoose from "mongoose";

const groupsSchema = new mongoose.Schema({
    host_id: {
        type: String,
        ref: 'User',
        required: true
    },
    members: [{
        type: String,
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