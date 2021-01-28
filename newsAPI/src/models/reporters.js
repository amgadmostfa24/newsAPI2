const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')


const reportersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error(`Email 3'lt 3la fkra`)
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password al "password" tb 2zay')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

reportersSchema.virtual('news', {
    ref: 'News',
    localField: '_id',
    foreignField: 'owner'
})
reportersSchema.methods.generateAuthToken = async function () {
    const reporters = this
    const token = jsonwebtoken.sign({ _id: reporters._id.toString() },'node course', {expiresIn:'6 days'})
    reporters.tokens = reporters.tokens.concat({ token })
    await reporters.save()
    return token
}
reportersSchema.methods.toJSON = function () {
    const reporters = this
    const reportersObject = reporters.toObject()
    delete reportersObject.password
    delete reportersObject.tokens
    return reportersObject
}
reportersSchema.statics.findByCredentials = async (email, password) => {
    const reporters = await Reporters.findOne({ email })
    if (!reporters) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, reporters.password)
    if (!isMatch) {
        throw new Error('Password is Incorrect')
    }
    return reporters
}
reportersSchema.pre('save', async function (next) {
    const reporters = this
    if (reporters.isModified('password')) {
        reporters.password = await bcrypt.hash(reporters.password, 8)
    }
    next()
})

const Reporters = mongoose.model('Reporters', reportersSchema)

module.exports = Reporters