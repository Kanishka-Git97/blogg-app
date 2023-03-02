import { Avatar, Popover } from 'antd';
import React, {useContext, useEffect, useState} from 'react'
import { Link, Navigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext';

function Header() {
  // State 
  const {setUser, user} = useContext(UserContext);

  async function validate(){
    await fetch('http://localhost:4040/api/profile',{
      credentials: 'include'
    }).then(response=>response.json()).then(user=>{
      setUser(user)
    })
  }


  useEffect(()=>{
     validate();
  },[])

  // Handle Logout
  function handleLogout(e) {
    e.preventDefault();
    fetch('http://localhost:4040/api/logout',{
      method: 'POST',
      credentials: 'include'
    }).then(response=>{
      setUser(null);
      window.location.replace('http://localhost:3000');
    });
    
  }

 

  // Profile Content 
  const content = (
    <div>
      <Link>Account Setting</Link><br />
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
            <Link>My Blogs</Link>      
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
