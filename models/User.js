const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, //trim은 space를 없애준다.
        unique: 1//unique해야한다.
    },
    password: {
        type: String,
        mixlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function(next){//저장하기 전에 뭔가를 한다.
    var user = this;

    if(user.isModified('password')){
        //비밀번호가 수정 되는 경우에만 비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)
            bcrypt.hash(user.password,salt, function(err, hash){
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    } else{
        next()
    }
})


userSchema.methods.comparePassword = function(plainPassword, cb){//cb = call back function
    //plainPassword  1234566 , 암호화된 비밀번호 $2bsasff~~
    //암호화한 후 같은지 확인
    bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
        if(err) return cb(err)
        cb(null, isMatch)//isMatch는 true
    })
}

userSchema.methods.generateToken = function(cb){
    var user = this;
    // jsonwebtoken을 이용해서 token을 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken')//이 두개를 합쳐서 토큰을 만듦

    user.token = token
    user.save((err, user) => {
        if(err) return cb(err)
        cb(null, user)
    })
}

const User = mongoose.model('User', userSchema);

module.exports = { User }