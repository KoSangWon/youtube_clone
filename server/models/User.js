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
        minlength: 5
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

//mongoose 결과
userSchema.pre('save', function(next){//저장하기 전에 뭔가를 한다.
    var user = this;

    if(user.isModified('password')){//password가 수정된다면
        //비밀번호가 수정 되는 경우에만 비밀번호를 암호화 시킨다. 왜냐하면 비밀번호 외에 이메일, 이름 등을 수정할 때에도 비밀번호를 암호화하면 안되기 때문이다. 그래서 비밀번호 수정될 때만 암호화.
        bcrypt.genSalt(saltRounds, function(err, salt){//10자리인 salt
            if(err) return next(err)
            bcrypt.hash(user.password, salt, function(err, hash){//user.password 는 plain password다.(그냥 비밀번호) 거기다가 salt를 뿌린다. hash는 암호화된 비밀번호
                if(err) return next(err)
                user.password = hash//암호화된 비밀번호 저장
                next()//돌아가자.
            })
        })
    } else{
        //비밀번호 바꿀 때가 아닌 다른 것을 바꿀 때 암호화를 하지 않고 next()를 통해 다음 것을 실행한다.
        next()
    }
})


userSchema.methods.comparePassword = function(plainPassword, cb){//cb = call back function
    //plainPassword  1234566 , 암호화된 비밀번호 $2bsasff~~
    //암호화한 후 같은지 확인
    bcrypt.compare(plainPassword, this.password, (err, isMatch) => {//bcrypt에서 제공하는 method
        if(err) return cb(err)
        cb(null, isMatch)//err는 없고 isMatch는 true
    })
}

userSchema.methods.generateToken = function(cb){
    var user = this;
    // jsonwebtoken을 이용해서 token을 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken')//이 두개를 합쳐서 토큰을 만듦

    user.token = token
    user.save((err, user) => {
        if(err) return cb(err)
        cb(null, user)//err는 null이고 user정보 전달
    })
}


userSchema.statics.findByToken = function(token, cb){
    var user = this;

    //토큰을 decode한다.
    jwt.verify(token, 'secretToken', function(err, decoded){
        //유저 아이디를 이용해서 유저를 찾은 다음에 클라이언트에서 가져온 토큰과 데이터베이스에 보관된 토큰이 일치하는지 확인
        user.findOne({"_id": decoded, "token": token}, function(err, user){
            if(err) return cb(err);
            cb(null, user);
        })
    })
}


const User = mongoose.model('User', userSchema);

module.exports = { User }