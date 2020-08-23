//hoc(higer order component)는 다른 component를 받은 후 새로운 component를 return 해주는 것이다.
//이것으로 인해 로그인(인증)된 유저들만 사용할 수 있는 기능을 만들 수 있다.
//FrontEnd(Auth)가 Backend로 request를 날리고 상태(인증유무)를 가져온다.

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../../_actions/user_action';


//export default 를 arrow function으로 사용시 다음과 같이 사용
//option에는 null(아무나 출입가능), true(로그인한 유저만 출입 가능한 페이지), false(로그인한 유저는 출입 불가능한 페이지)가 있다.
export default (SpecificComponent, option, adminRoute = null) => {
    
    const dispatch = useDispatch();

    const AuthenticationCheck = (props) => {
        useEffect(() => {
            // redux 안쓴다면 Axios.get('/api/users/auth') 이런 방식으로 사용
            dispatch(auth())
                .then(response => {
                    console.log(response);

                    //로그인 하지 않은 상태
                    if(!response.payload.isAuth) {
                        if(option) {
                            props.history.push('/login')
                        }
                    } else {
                        //로그인 한 상태
                        if(adminRoute && !response.payload.isAdmin) {
                            props.history.push('/')
                        } else {
                            if(option === false){
                                props.history.push('/')
                            }
                        }
                    }

                })
        }, [props.history])

        return (
            <SpecificComponent/>
        )
    }

    return AuthenticationCheck
}