const {User} = require("../models/User");

let auth = (req, res, next) => {
    //인증처리 하는 곳
    
    //클라이언트 쿠키에서 토큰을 가져온다.
    let token = req.cookies.x_auth;

    //토큰을 복호화한 후 유저를 찾는다.
    User.findByToken(token, (err, user)=>{
        if(err) throw err;
        if(!user) return res.json({isAuth: false, error: true});

        req.token = token;//token을 사용할 수 있게 req.token에 넣어준다.
        req.user = user;
        next();//next()를 안해주면 미들웨어에서 갇히는 것이다. 따라서 다음으로 진행하라는 명령인 next()를 넣어준다.
    })

    //유저가 있으면 인증 OK
    
    //유저가 없으면 인증 NO
}

module.exports = {auth};