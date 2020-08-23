const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const config = require('./config/key')

const {auth} = require('./middleware/auth');
const {User} = require('./models/User');

//application/x-www-form-urlencoded 이런 형태를 분석해서 가져올 수 있게 해줌.
app.use(bodyParser.urlencoded({encoded: true}));

//json형태의 데이터를 가져올 수 있게 해줌.
app.use(bodyParser.json())
app.use(cookieParser());//cookieParser사용

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false //안쓰면 에러가 뜸.
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))


app.get('/', (req, res) => res.send('Hello'))




app.get('/api/hello', (req, res) => {
    res.send('안녕하세d요~');
})


//Router기능을 사용하기 위해 /api/~~를 사용하는 것이 좋다.
//그냥 쓰면 파일이 매우 길어지기 때문에 express의 router기능을 사용해서 분리한다.
app.post('/api/users/register', (req, res) => {
    //회원 가입 할 때 필요한 정보들을 client에서 가져오면 그것들을 데이터베이스에 넣어준다.
    const user = new User(req.body)

    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err})
        return res.status(200).json({
            success:true
        })
    })
})

app.post('/api/users/login', (req, res) => {
    //요청된 이메일이 데이터베이스에 있는지 찾는다.
    //findOne함수 사용법 기억하기.
    User.findOne({email: req.body.email}, (err, user) => {
        if(!user){
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch){
                return res.json({
                    loginSuccess: false,
                    message: "비밀번호가 틀렸습니다."
                })
            }
            //비밀번호까지 같다면 Token을 생성
            user.generateToken((err, user)=>{
                if(err) return res.status(400).send(err);

                // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지 등등에 저장할 수 있다.(여기선 쿠키)
                res.cookie("x_auth", user.token)
                .status(200)
                .json({
                    loginSuccess: true,
                    userId: user._id
                })
            })
        })
    })

})


//auth 는 미들웨어, 인증여부를 알려줌.
app.get('/api/users/auth', auth, (req, res) => {
    //여기까지 미들웨어를 통과했다는 얘기는 Authentication이 True라는 말.
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false: true,//role 0 -> 일반유저, 0 아니면 관리자
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({_id: req.user._id}, {token: ""}, (err, user) => {//토큰을 지워주기만하면 로그아웃됨.
        if(err) return res.json({success: false, err});
        return res.status(200).send({
            success: true
        })
    })
})

const port = 5000

app.listen(port, () => console.log(`Example app listening on port ${port}`))