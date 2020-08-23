import React, {useState} from 'react'
import { useDispatch} from 'react-redux';
import { loginUser, registerUser } from '../../../_actions/user_action';
import { REGISTER_USER } from '../../../_actions/types';

const RegisterPage = (props) => {
    const dispatch = useDispatch()

    const [Email, setEmail] = useState("")
    const [Name, setName] = useState("")
    const [Password, setPassword] = useState("")
    const [ConfirmPassword, setConfirmPassword] = useState("")


    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value);//입력한 값을 화면에 표시해주기 위함.
    }

    const onNameHandler = (event) => {
        setName(event.currentTarget.value);
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    }

    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value);
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();//이것을 하지 않으면 새로고침이 되어 입력한 이메일과 비밀번호가 사라진다.
        console.log('Email: ', Email);
        console.log('Password: ', Password);

        if(Password !== ConfirmPassword) {
            return alert('비밀번호와 비밀번호 확인은 같아야 합니다.');
        }

        let body = {
            email: Email,
            name: Name,
            password: Password,
            
        }

        //redux를 사용하지 않는다면 Axios.post('/api/users/register', body) 식으로 사용

        dispatch(registerUser(body))
            .then(response => {
                console.log('response',response)
                console.log('response.payload',response.payload)

                if(response.payload.success){
                    props.history.push('/login')//페이지 이동
                }else{
                    alert('Failed to Sign Up');
                }
            })

    }


    return (
        <div style={{display:'flex', justifyContent: 'center', alignItems:'center', width:'100%', height:'100vh'}}>
            
            <form style={{display:'flex', flexDirection:'column'}}
                onSubmit={onSubmitHandler}
            >
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler}/>

                <label>Name</label>
                <input type="text" value={Name} onChange={onNameHandler}/>

                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler}/>

                <label>Confirm Password</label>
                <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler}/>

                <br/>
                <button type="submit">
                    회원 가입
                </button>
            </form>

        </div>
    )
}

export default RegisterPage;
