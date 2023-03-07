import './App.css';
import 'antd/dist/reset.css';
import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home';
import Login from './pages/Login';
import Layout from './components/Layout';
import Register from './pages/Register';
import { UserContextProvider } from './context/UserContext';
import Create from './pages/Create';
import PostPage from './pages/PostPage';
import Edit from './pages/Edit';
import MyBlogs from './pages/MyBlogs';
import Account from './pages/Account';




function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path='/create' element={<Create/>}/>
          <Route path='/post/:id' element={<PostPage/>}/>
          <Route path='/edit/:id' element={<Edit/>}/>
          <Route path='/posts/:id' element={<MyBlogs/>}/>
          <Route path='/account/:id' element={<Account/>}/>
        </Route> 
      </Routes>
    </UserContextProvider>
    
  );
}

export default App;
