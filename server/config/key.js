if(process.env.NODE_ENV === 'production'){//process.env.NODE_ENV 값이 배포냐 local이냐에 따라 값이 다르게 나온다.
    module.exports = require('./prod')//배포했을 때
} else {
    module.exports = require('./dev')// local에서 작업했을 때
}