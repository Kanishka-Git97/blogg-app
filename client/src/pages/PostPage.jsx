import { Avatar, Col, Image, Input, List, Row, Space, Button, Empty } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import VirtualList from 'rc-virtual-list';
import { SendOutlined, EditOutlined } from '@ant-design/icons';
import ReactTimeAgo from 'react-time-ago'
import { UserContext } from '../context/UserContext';
import {Link} from 'react-router-dom'
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
function PostPage() {
    const {id} = useParams();
    const [post, setPost]= useState(null);
    const [comments, setComments]= useState([]);
    const [comment, setComment]= useState('');
    const ContainerHeight = 200;
    const {user} = useContext(UserContext);

    const onScroll = (e) => {
        if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === ContainerHeight) {
        //   appendData();
        }
    };

    // Handle Comment Submitted
    async function handleCommentSubmitted(){
       const response =  await fetch(`${SERVER_URL}/api/comment/add`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({post: post._id, comment: comment})
        });
        if(response.ok){
            setComment('');
            handleCommentFetch();
        }
    }

    async function handleCommentFetch(){
        await fetch(`${SERVER_URL}/api/comments/${id}`).then(response => response.json()).then(comments=>{
            setComments(comments);
        })
    }

    useEffect(()=>{
        fetch(`${SERVER_URL}/api/post/${id}`).then(response => response.json()).then(post=>{
            setPost(post);
        })
        handleCommentFetch();
    },[]);

    if(!post) return '';

  return (
    <div className='post-page'>
        <div className='header-section'>
           <Row>
            <Col span={10} className='image'>
                <Image src={`${SERVER_URL}/${post.file}`} style={{ borderRadius: '10px' }}/>
            </Col>
            <Col span={14} className='comment-section'>
                <span>Comments</span>
                {
                    comments.length > 0 && (
                        <List>
                            <VirtualList
                                data={comments}
                                height={ContainerHeight}
                                itemHeight={30}
                                itemKey="_id"
                                onScroll={onScroll}
                            >
                                {
                                    (comment)=>(
                                        <List.Item key={comment._id}>
                                            <List.Item.Meta
                                                avatar={<Avatar>{comment.user.name.charAt(0)}</Avatar>}
                                                title= {comment.user.name}
                                                description= {comment.comment}
                                            />
                                        </List.Item>
                                    )
                                }
                            </VirtualList>
                        </List>
                    )
                }
                {
                    comments.length === 0 && (
                        <Empty description={false} />
                    )
                }
                {
                    user !== null &&(
                    <Space className='add-comment'>
                        <Input placeholder='Comment' value={comment} onChange={(e)=>setComment(e.target.value)}/> 
                        <Button onClick={handleCommentSubmitted} type="primary" shape="circle" icon={<SendOutlined />} />
                     </Space>
                    )
                }
                
            </Col>
           </Row>
        </div>
        
        <div className='content'>
            <h1>{post.title}</h1>
            <div className='date'>{post.author.name} | <ReactTimeAgo date={new Date(post.createdAt)} locale="en-US"/></div>
            {user && user.id === post.author._id && (
                <div className='edit-btn'><Link to={`/edit/${post._id}`}><Button><EditOutlined /> Edit this Blog</Button></Link></div>
            )}
            <div className='summary'>
                <span>{post.summary}</span>
            </div>
            <div dangerouslySetInnerHTML={{ __html:post.post }} />
        </div>
    </div>
  )
}

export default PostPage
