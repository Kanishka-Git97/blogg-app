import React, { useContext, useState } from 'react'
import {Input, Button, notification} from 'antd'
import {Navigate} from 'react-router-dom'
import { UserContext } from '../context/UserContext';
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const {setUser} = useContext(UserContext);

  async function handleLogin(e){
    e.preventDefault();
    const response = await fetch(`${SERVER_URL}/api/login`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      }),
      credentials: 'include',
    })

    if(response.ok){
      // Logged in
      response.json().then(user =>{
        setUser(user);
        setRedirect(true);
      })
     

    }else{
      openNotification('Login Failed','Invalid Credentials, Please try again');
    }
  }

  const openNotification = (title, description) => {
    notification.open({
      message: title,
      description:
       description,
      onClick: () => {
        console.log('Notification Clicked!');
      },
      placement: 'bottom',
    });
  };

  if(redirect) {
    return <Navigate to='/'/>
  }
  
  return (
    <form className='login'>
        <div className='title'>Login</div>
        <div className='tag'>Welcome to Bloggy, Please Enter your login details to start using the app </div>
        <Input 
          type='email'
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className='input'
          placeholder='Email' />
        <Input 
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className='input'
          placeholder='Password'
          type='password'  />
        <Button type='primary' onClick={handleLogin} className='btn'>Login</Button>
    </form>
  )
}

export default Login
