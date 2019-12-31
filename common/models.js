const mongoose = require('mongoose');

const config = require('./config');

mongoose.set('useCreateIndex', true);
mongoose.connect(config.mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: ''
    },
    message: {
        type: String,
        default: ''
    }
});

const MessageSchema = mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    channel: {
        type: String,
        required: true
    },
    content: String,
    attachments: {
        images: {
            type: [{
                src: String,
                name: String,
                size: Number
            }],
            default: []
        },
        files: {
            type: [{
                src: String,
                name: String,
                size: Number
            }],
            default: []
        }
    },
    code: {
        language: String,
        content: String,
        stdin: String,
        stdout: String,
        stderr: String
    },
}, {
    timestamps: {
        createdAt: 'timestamp',
        updatedAt: 'editedTimestamp'
    }
});


const ChannelSchema = mongoose.Schema({
    name: String,
    icon: String,
    members: {
        type: [{
            id: String,
            level: {
                type: Number,
                default: 0
            }
        }],
        default: []
    },
    public: Boolean
});



module.exports = {
    User: mongoose.model('User', UserSchema),
    Message: mongoose.model('Message', MessageSchema),
    Channel: mongoose.model('Channel', ChannelSchema)
};