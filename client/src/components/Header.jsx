import { Avatar, Popover } from 'antd';
import React, {useContext, useEffect, useState} from 'react'
import { Link, Navigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const BASE_URL = process.env.REACT_APP_BASE_URL;

function Header() {
  // State 
  const {setUser, user} = useContext(UserContext);

  async function validate(){
    await fetch(`${SERVER_URL}/api/profile`,{
      credentials: 'include'
    }).then(response=>response.json()).then(user=>{
      setUser(user)
    })
  }


  useEffect(()=>{
     validate();
     console.log(user);
  },[])

  // Handle Logout
  function handleLogout(e) {
    e.preventDefault();
    fetch(`${SERVER_URL}/api/logout`,{
      method: 'POST',
      credentials: 'include'
    }).then(response=>{
      setUser(null);
      console.log(SERVER_URL)
      // const url = 
      window.location.replace(`${BASE_URL}/`);
    });
    
  }

 

  // Profile Content 
  const content = (
    <div>
      {
        user && (
          <><Link to={`/account/${user.id}`}>Profile Information</Link><br /></>
        )
      }
      <a onClick={handleLogout} style={{ color: 'redAccent' }}>Logout</a>
    </div>
  );

  return (
    <header>
        <Link to="/" className="logo">Bloggy.</Link>
        <nav>
          {user && (
           <>
            <Link to='/create'>Create new blog</Link>
            <Link to={`/posts/${user.id}`}>My Blogs</Link>      
             <Popover content={content} title={user.name} trigger='click' >
               <Avatar style={{ cursor: 'pointer' }}>{user.name.charAt(0)}</Avatar>
             </Popover>
           </>
          )}
          {!user && (
            <>
              <Link to="/login" className="">Login</Link>
              <Link to="/register" className="">Register</Link>
            </>
          )}
          
        </nav>
      </header>
  )
}

export default Header
