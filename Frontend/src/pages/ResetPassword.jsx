import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate} from 'react-router-dom';
import { useState } from 'react';
import { useRef } from'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';


const ResetPassword = () => {
    const {backendUrl} = useContext(AppContext);
    axios.defaults.withCredentials = true;


  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState('');
  const [otp, setOtp] = useState(0);
  const [isOtpSubmited, setIsOtpSubmited] = useState(false);

  const inputRefs= useRef([]);   // Array to hold references to input fields
    const handleInput=(e,index)=>{
      if(e.target.value.length > 0 && index < inputRefs.current.length-1){
        inputRefs.current[index+1].focus();  // Move focus to the next input field
      }
    }
    const handleKeyDown=(e,index)=>{
      if(e.key === 'Backspace'  && e.target.value === '' && index > 0){
       inputRefs.current[index-1].focus(); // Move focus to the
      }
    }
   const handlePaste =(e)=>{
      const paste= e.clipboardData.getData('text');
      const pasteArray= paste.split('');
      pasteArray.forEach((data,index)=>{
        if(inputRefs.current[index]){
          inputRefs.current[index].value=data;
        }
      })
   }
   const onSubmitEmail = async (e)=>{
    e.preventDefault();
    try{
      const {data} = await axios.post(`${backendUrl}/auth/send-reset-otp`, { email });
      if(data.success){
        setIsEmailSent(true);
        toast.success(data.message);
      }else{
        toast.error(data.message);
      }
    }catch(error){
      toast.error('Failed to send email');
    }
   }
   
   const onSubmitOtp = async (e)=>{
    e.preventDefault();
    const otpArray = inputRefs.current.map(input=>input.value);
    setOtp(otpArray.join(''));
    setIsOtpSubmited(true);
    }
  
    const onSubmitNewPassword = async (e)=>{

      e.preventDefault();
      try{
        const {data} = await axios.post(`${backendUrl}/auth/reset-password`, { email, otp, newPassword });
        if(data.success){
          toast.success(data.message);
          navigate('/login');
        }else{
          toast.error(data.message);
        }
      }catch(error){
        toast.error('Failed to reset password');
      }
    }
  return (
    <div className='bg-gradient-to-br from-blue-200 to-purple-400
    flex flex-col items-center justify-center min-h-screen
   px-6 sm:px-0 bg-purple-400'>
   <img onClick={()=>navigate('/')} src={assets.logo} className='absolute left-5 sm:left-20
         top-5 w-28 sm:w-32 cursor-pointer'/>

      {/* Email input form */}
        {/* // email not sent yet */}

      {!isEmailSent &&
      <form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 text-indigo-300 rounded-lg w-96 text-sm'>
      <h1 className='text-white text-center text-2xl font-semibold mb-4'>Reset Password</h1>
      <p className='text-center mb-6 text-indigo-300'>Enter your registered email id. </p>
      <div className='mb-4 flex items-center gap-3 w-full  px-6 py-2.5 rounded-full bg-[#333a5c]'>
        <img src={assets.mail_icon} className='w-3 h-3 '/>
        <input type='email' placeholder='Email id' className='w-full bg-transparent outline-none text-white'
        value={email} onChange={(e)=>setEmail(e.target.value)} required/>
      </div>
      
      <button className=' w-full mt-3 px-4 py-2.5 rounded-full text-white bg-indigo-500 hover:bg-indigo-600'>Submit</button>
      </form>
      }

        {/* otp input form  */}


        {!isOtpSubmited && isEmailSent && 
<form onSubmit={onSubmitOtp} className='bg-slate-900 p-8 rounded-lg w-full sm:w-96 text-sm'>
      <h1 className='text-white text-center text-2xl font-semibold mb-4'>Reset Password  OTP</h1>
   <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email id. </p>
   <div className='flex justify-between mb-8' onPaste={handlePaste}>
     {Array(6).fill(0).map((_,index)=>(
      <input type='text' maxLength='1' 
      ref={e=>inputRefs.current[index]=e}
      onInput={(e)=>handleInput(e,index)} key={index} required 
      onKeyDown={(e)=>handleKeyDown(e,index)}
       className=' rounded-md w-12 h-12 bg-[#333a5c] text-white text-xl text-center'/>
     ))}
   </div>
    <button className='w-full py-2.5 text-white rounded-full bg-blue-500 hover:bg-blue-700 transition-all'>Submit</button>
      </form>
      }
      {/* Enter New Password */}

{isOtpSubmited && isEmailSent && 

      <form onSubmit={onSubmitNewPassword} className='bg-slate-900 p-8 text-indigo-300 rounded-lg w-96 text-sm'>
      <h1 className='text-white text-center text-2xl font-semibold mb-4'>New Password</h1>
      <p className='text-center mb-6 text-indigo-300'>Enter new password below </p>
      <div className='mb-4 flex items-center gap-3 w-full  px-6 py-2.5 rounded-full bg-[#333a5c]'>
        <img src={assets.lock_icon} className='w-3 h-3 '/>
        <input type='password' placeholder='Password' className='w-full bg-transparent outline-none text-white'
        value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} required/>
      </div>
      
      <button className=' w-full mt-3 px-4 py-2.5 rounded-full text-white bg-indigo-500 hover:bg-indigo-600'>Submit</button>
      </form>
      }
    </div>
  )
}

export default ResetPassword
