import mongoose from "mongoose";
import { GenderEnums, ProviderEnums } from '../../common/index.js'

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
        required: true
    },
    phone: String,
    DOB: Date,
    gender: {
        type: String,
        enum: Object.values(GenderEnums),
        default: GenderEnums.Male
    },
    provider: {
        type: String,
        enum: Object.values(ProviderEnums),
        default: ProviderEnums.System
    }
})



UserSchema.virtual('userName').set(function (value) {
    let [firstName, lastName] = value.split(' ')
    this.firstName = firstName
    this.lastName = lastName
}).get(function () {
    return `${this.firstName} ${this.lastName}`
})

export const userModel = mongoose.model('User', UserSchema)
