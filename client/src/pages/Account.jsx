import React, { useState, useEffect, useContext } from 'react'
import { UserOutlined, CommentOutlined } from '@ant-design/icons';
import { Avatar, Button, Input, Row, Col, Statistic } from 'antd';
import CountUp from 'react-countup';
import { useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const formatter = (value) => <CountUp end={value} separator="," />;
function Account() {
    const {user} = useContext(UserContext);
    const {id} = useParams();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
   

    async function getDetails(_id){
        await fetch(`${SERVER_URL}/api/my/${id}`).then(response=>response.json()).then(async data=>{
            setPosts(data);
            data.map(async (post)=>{
               var response = await fetch(`${SERVER_URL}/api/comments/${post._id}`).then(response=>response.json());
               setComments(...comments, response);
            })
        })  
        setName(await user.name);
        setEmail(await user.email);
    }
    
    // Handle Profile Update Event
    async function handleProfileUpdate(){
        if(name === "" || email === ""){
            console.log("error");
        }
        else{
            const response = await fetch(`${SERVER_URL}/api/profile/update`,{
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name: name, email: email}),
                credentials: 'include'
            })
            if(response.ok){
                console.log("Updated profile");
            }
        }
    }

    useEffect(()=>{
        getDetails(id);
    },[])
    

  return (
    <div className='account-section'>
       <Row gutter={16}>
        <Col>
            <Avatar shape="square" size={100} icon={<UserOutlined />} />
        </Col>
        <Col>
        <Statistic title="Your Active Blogs" value={posts.length} formatter={formatter} />
        </Col>
        <Col>
            <Statistic title="Community Comments" value={comments.length} formatter={formatter} prefix={<CommentOutlined />}  />
        </Col>
       </Row>
        <div className='header-section'>
            <h1>My Profile</h1>
            <span>Update with your latest details with your audience</span>
        </div>
        <div className='form-content'>
            <Input 
                placeholder='Full Name'
                value={name}
                onChange={(e)=>setName(e.target.value)}
                readOnly
            />
             <Input 
                placeholder='Email'
                type='email'
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                readOnly
            />
            <Button hidden onClick={handleProfileUpdate}>Update Profile</Button>
        </div>
    </div>
  )
}

export default Account
