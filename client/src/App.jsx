import './App.css';
import './Components/auth.css';

import { Routes, Route } from 'react-router-dom';

import Login from './Components/Login.jsx';
import Register from './Components/Register.jsx';
import Forget from './Components/Forget.jsx';
import OTPVerify from './Components/OTPVerify.jsx';
import UpdatePassword from './Components/UpdatePassword.jsx';
import Profile from './Components/Profile.jsx';
import Super from './Components/Super.jsx';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forget" element={<Forget />} />
      <Route path="/otp/verify" element={<OTPVerify />} />
      

      {/* Protected Routes */}
      <Route element={<Super />}>
        <Route path="/" element={<Profile />} />
        <Route path="/password/update" element={<UpdatePassword />} />
      </Route>
    </Routes>
  );
}

export default App;
