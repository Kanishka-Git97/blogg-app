import { Button, Input, Upload, Modal, Form, Switch } from 'antd'
import React, { useContext, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { PlusOutlined } from '@ant-design/icons';
import {Navigate} from 'react-router-dom';
import { UserContext } from '../context/UserContext';

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

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
});

function Create() {
  // States 
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [post, setPost] = useState('');
  const [redirect, setRedirect] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);

  
  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  async function handleCreatePost(e){
    e.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('post', post);
    data.set('file', fileList[0].originFileObj);

    console.log(fileList);
    const response = await fetch('http://localhost:4040/api/create',{
      method: 'POST',
      body:data,
      credentials: 'include'
    })
    if(response.ok){
      setRedirect(true);
    }
  }

  if(redirect){
    return <Navigate to='/'/>
  }

  return (
    <form className='add-post'>
       <div className='title'>Create Post</div>
        <div className='tag'>Complete your Blog Post details, to engage with your audience</div>
        <div style={{ paddingTop: '10px' }}>
          <Upload
           
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
          <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
            <img
              alt="example"
              style={{
                width: '100%',
              }}
              src={previewImage}
            />
          </Modal>
        </div>
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
       
      <Button type='primary' onClick={handleCreatePost}>Create Blog Post</Button>
    </form>
  )
}

export default Create
