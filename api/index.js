const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const User = require('./models/User');
const Post = require('./models/Post');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const fs = require('fs');
const Comment = require('./models/Comment');

const app = express();

// Middleware Configuration
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

// Encryption Salt 
const salt = bcrypt.genSaltSync(10);
const secret = 'jLIOgsuYd0Bdmy10dZmN1SravfeSHlRa';

// Database Connection
mongoose.connect('mongodb+srv://bloggy:PbcxYsVveCfQ0yuM@cluster0.qcmhuuh.mongodb.net/?retryWrites=true&w=majority');

// Testing Server 
app.get('/api/test',(req, res)=>{
    res.json('Bloggy API Successfully Run on http://localhost:4040/api')
})

// Registration Request
app.post('/api/register', async(req, res)=>{
    const {name, email, password} = req.body;
    try{
        const userDoc = await User.create({name, email, password: bcrypt.hashSync(password,salt)});
        res.json(userDoc);
    }catch(err){
        res.status(400).json(err);
    }
})

// Login Request
app.post('/api/login', async(req, res) => {
    const {email, password} = req.body;
    const userDoc = await User.findOne({email});
    console.log(userDoc);
    const passwordFlag = bcrypt.compareSync(password, userDoc.password);
    if(passwordFlag){
        // Logged
        jwt.sign({email, id: userDoc._id, name: userDoc.name}, secret, {}, (err, token)=>{
            if(err) throw err;
            res.cookie('token', token).json({
                name: userDoc.name,
                id: userDoc._id,
                email: userDoc.email
            });
        }); 
    }
    else{
        // Not logged
        res.status(400).json({message: 'Invalid Credentials'});
    }
})

// Token Validation Request
app.get('/api/profile', (req, res)=>{
   const {token} = req.cookies;
   jwt.verify(token, secret, {}, (err, info)=>{
    if(err) throw err;
    res.json(info);
   })
})

// Logout Request
app.post('/api/logout', (req, res)=>{
    res.cookie('token', '').json('ok');
})

// Create Post Request 
app.post('/api/create', upload.single('file'), async (req, res)=>{
    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const filePath = path+'.'+ext;
    fs.renameSync(path, filePath);
    
    // Get Author
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info)=>{
        if(err) throw err;
        const {title, summary, post} = req.body;
        const postDocument = await Post.create({
            title,
            summary,
            post,
            file: filePath,
            author:info.id
        })
        res.json(postDocument);
        // res.json(info);
    });
    
})

// Update Post Request
app.put('/api/update', async (req, res)=>{
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info)=>{
        if(err) throw err;
        const {title, summary, post, id} = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
       if(!isAuthor){
        return res.status(404).json('Unauthorized Action');
       }
        await postDoc.updateOne({title, summary, post});
        res.json("ok");
    });
})

// Get Posts 
app.get('/api/posts', async (req, res)=>{
    res.json(
        await Post.find()
        .populate('author', ['name', 'email', 'id'])
        .sort({createdAt: -1})
        .limit(20)
        );
})

// Get Single Post
app.get('/api/post/:id', async(req, res)=>{
   const {id} = req.params;
   res.json(await Post.findById(id).populate('author', ['name', 'email', 'id']));
})

// Add Comment to the Post
app.post('/api/comment/add', async(req, res)=>{
   
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info)=>{
        if(err) throw err;
        const {comment, post} = req.body;
        const commentDoc = await Comment.create({
            comment: comment,
            post,
            user: info.id
        })
        res.json(commentDoc);
    });
})

// All Comments get 
app.get('/api/comments/:id', async(req, res)=>{
    const {id} = req.params;
    res.json(await Comment.find({post: id})
        .populate('user',['name', 'email'])
        .sort({createdAt: -1})
    )
})

app.listen(4040);
console.info('Server Start on: http://localhost:4040/api');


// bloggy
// PbcxYsVveCfQ0yuM

// mongodb+srv://bloggy:PbcxYsVveCfQ0yuM@cluster0.qcmhuuh.mongodb.net/?retryWrites=true&w=majority