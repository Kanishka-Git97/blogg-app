import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ReactTimeAgo from 'react-time-ago'
import { CommentOutlined, LikeOutlined } from  '@ant-design/icons';

function Post({_id,title, summary, file, createdAt, author}) {
  const [comments, setComments] = useState([]);
  // handle comments
  async function handleCommentFetch(){
    await fetch(`http://localhost:4040/api/comments/${_id}`).then(response => response.json()).then(comments=>{
        setComments(comments);
    })
  }

  useEffect(()=>{
    handleCommentFetch();
  },[])

  return (
    <div className="post" style={{  padding: '10px', borderRadius: '10px' }}>
        <div className="image">
          <Link to={`/post/${_id}`}>
            <img src={`http://localhost:4040/${file}`} alt="" style={{ borderRadius: '10px' }}/>
          </Link>
        </div>
        <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>   
        <p className='info'>
            <a href="#">{author.name}</a>
            <time><ReactTimeAgo date={new Date(createdAt)} locale="en-US"/></time>
        </p>
        <p className="summary">{summary}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',  }}>
          <div className='comment-section'><CommentOutlined /> <span style={{ marginLeft: '2px', fontSize: '10px' }}>{`Comments ${comments.length}`}</span></div>
        </div>
        </div>
  </div>
  )
}

export default Post
