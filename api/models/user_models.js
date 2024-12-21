const { mongoose } = require('./common_models');
const Schema = mongoose.Schema;

const UserTypeSchema = new Schema({
    _id: Number,
    utype: {
        type: String,
        unique: true,
        dropDups: true,
        lowercase: true,
        trim: true
    }
});

const UserType = mongoose.model("UserType", UserTypeSchema, "usertype");

const UserLoginSchema = new Schema({
    _id: Number,
    usertype: { type: Number, ref: "UserType" },
    uname: {
        type: String,
        select: false,
        unique: true,
        dropDups: true,
        lowercase: true,
        trim: true
    },
    passwd: { type: String, select: false }
});

const UserInfoSchema = new Schema({
    _id: Number,
    userlogin: UserLoginSchema,
    name: String,
    address: String,
    contact: String
});

const UserInfo = mongoose.model("UserInfo", UserInfoSchema, "userinfo");

module.exports = {
    UserType: UserType,
    UserInfo: UserInfo
};
