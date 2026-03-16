import mongoose from "mongoose";
import { GenderEnums, ProviderEnums, roleEnums } from '../../common/index.js'

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 20
    },
    lastName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 20
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function () {
            return this.provider == ProviderEnums.System
        }
    },
    phone: {
        type: String,
        required: function () {
            return this.provider == ProviderEnums.System
        }

    },
    dateOfBirth: {
        type: Date,
        required: function () {
            return this.provider == ProviderEnums.System
        }

    },
    gender: {
        type: String,
        enum: Object.values(GenderEnums),
        default: GenderEnums.Male
    },
    provider: {
        type: String,
        enum: Object.values(ProviderEnums),
        default: ProviderEnums.System
    },
    role: {
        type: String,
        enum: Object.values(roleEnums),
        default: roleEnums.User

    }, shareProfileName: {
        type: String,
        required: true,
        unique: true


    },
    profilePicture: String,
    confireEmail: Date
})



UserSchema.virtual('userName').set(function (value) {
    let [firstName, lastName] = value.split(' ')
    this.firstName = firstName
    this.lastName = lastName
}).get(function () {
    return `${this.firstName} ${this.lastName}`
})

export const userModel = mongoose.model('User', UserSchema)
