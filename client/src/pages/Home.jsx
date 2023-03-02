import React, { useEffect, useState } from 'react'
import Post from '../components/Post'
import {Empty, Button, Space, Spin} from 'antd'
import { Link } from 'react-router-dom';


function Home() {
  // States 
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    
    setTimeout(()=>{
      fetch('http://localhost:4040/api/posts').then(response=>response.json()).then(posts=>{
          setPosts(posts);
          setLoading(false);
      })      
    }, 2000)
  },[])

  return (

    <div className='home-page'>
        {
          loading && (
            <center size="middle">
              <Spin size="large" />
            </center>
          )
        }
        {
         posts.length > 0 && (
          posts.map((post)=>{
            return  <Post {...post} key={post._id}/>
          })
         )
        }
        {
          posts.length === 0 && loading===false && (
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{
                height: 60,
              }}
              description={
                <span>
                  No Blog Posts Available Right Now
                </span>
              }
            >
              <Link to={'/create'}><Button style={{ backgroundColor: '#333' }} type="primary">Create Now</Button></Link>
            </Empty>
          )
        }
    </div>
  
  )
}

export default Home
