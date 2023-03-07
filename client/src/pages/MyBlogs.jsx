import { Button, Empty, Spin } from 'antd';
import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import Post from '../components/Post';


const SERVER_URL = process.env.REACT_APP_SERVER_URL;
function MyBlogs() {
  // States
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const {id} = useParams();
  useEffect(()=>{
    
    setTimeout(()=>{
      fetch(`${SERVER_URL}/api/my/${id}`).then(response=>response.json()).then(posts=>{
          setPosts(posts);
          setLoading(false);
      })      
    }, 2000)
  },[])

  return (
    <div className='my-blogs'>
      {
        loading && (
          <center>
            <Spin size='large'/>
          </center>
        )
      }
      {
        posts.length === 0 && loading===false &&(
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
      {
        posts.length > 0 && (
          posts.map((post)=>{
            return <Post {...post} key={post._id} />
          })
        )
      }
    </div>
  )
}

export default MyBlogs;
