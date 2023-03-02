import React, { useState } from 'react'
import {Input, Button, notification} from 'antd'
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const Register = () => {
  const [name, setName] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  async function handleRegister(e) {
    e.preventDefault();
    if(password !== confirmPassword) {
      return openNotification('Invalid Input', 'Password does not matched, Please enter a valid password');
    }
    
    const response = await fetch(`${SERVER_URL}/api/register`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name, email, password})
    });

    if(response.status !== 200){
      openNotification('Registration Failed', 'Something went wrong, Please try again');
    }else{
      openNotification('Registration Success', `Successfully registered under email: ${email}`);
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
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

  return (
    <form className='register'>
      <div className='title'>Register</div>
        <div className='tag'>Welcome to Bloggy, Please Enter your login details to start using the app </div>
        <Input 
          onChange={(e)=>setName(e.target.value)}
          className='input' 
          value={name}  
          placeholder='Full Name' />
        <Input 
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
        <Input 
          value={confirmPassword}
          onChange={(e)=>setConfirmPassword(e.target.value)}
          className='input'
          placeholder='Confirm Password'
          type='password'  />
        <Button type='submit' onClick={handleRegister}   className='btn'>Register</Button>
    </form>
  )
}

export default Register
