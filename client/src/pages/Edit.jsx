import React, {useState, useEffect} from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { PlusOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill'
import { Button, Input, Upload, Modal } from 'antd'

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const modules = {
    toolbar:[
      [{'header': [1, 2, false]}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ]
  }
  
  const formats = [
    'headers',
    'bold', 'italic', 'underline', 'strike', 'blockquote', 
    'list', 'bullet', 'indent',
    'link', 'image'
  ]
  
 

function Edit() {
    const {id} = useParams();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [post, setPost] = useState('');
    const [redirect, setRedirect] = useState(false);
    

    async function handleBlogUpdate(e){
        e.preventDefault();
        // const data = new FormData();
        // data.set('id', id);
        // data.set('title', title);
        // data.set('summary', summary);
        // data.set('post', post);
     
        const response = await fetch(`${SERVER_URL}/api/update`,{
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify({id: id, title: title, summary: summary, post: post}),
            credentials: 'include'
        })
        if(response.ok){
            setRedirect(true);
        }
    }
    

    useEffect(()=>{
        fetch(`${SERVER_URL}/api/post/${id}`).then(response => response.json()).then(post=>{
            setTitle(post.title);
            setSummary(post.summary);
            setPost(post.post);
        })
       
    },[]);

    if(redirect){
        return <Navigate to={`/post/${id}`}/>
    }

  return (
    <form className='add-post'>
    <div className='title'>Edit Post</div>
     <div className='tag'>Complete your Blog Post details, to engage with your audience</div>
     
   <Input 
     value={title}
     onChange={(e)=>setTitle(e.target.value)}
     placeholder='Title'/>
   <Input 
     value={summary}
     onChange={(e)=>setSummary(e.target.value)}
     placeholder='Blog Summary'/>
   
   <ReactQuill
     value={post}
     onChange={(value)=>setPost(value)}
     modules={modules}
     formats={formats}
     />
    
   <Button type='primary' onClick={handleBlogUpdate}>Update Blog Post</Button>
 </form>
  )
}

export default Edit
