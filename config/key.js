if(process.env.NODE_ENV === 'production'){
    module.exports = require('./prod')//배포했을 때
} else {
    module.exports = require('./dev')// local에서 작업했을 때
}