import React, { useRef, useContext, useEffect } from 'react'
import axios from 'axios'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import { toast } from 'react-toastify'

const EmailVerify = () => {

  axios.defaults.withCredentials = true;

  const navigate = useNavigate()
  const inputRefs = useRef([])

  const { backendUrl, getUserData, userData, isLoggedin } = useContext(AppContent)

  // ✅ Redirect if already verified
  useEffect(() => {
    if (isLoggedin && userData?.isAccountVerified) {
      navigate('/')
    }
  }, [isLoggedin, userData])

  // 🔥 Move forward
  const handleInput = (e, index) => {
    const value = e.target.value

    // Allow only numbers
    if (!/^\d?$/.test(value)) {
      e.target.value = ''
      return
    }

    if (value && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  // 🔥 Backspace move back
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  // 🔥 Paste full OTP
  const handlePaste = (e) => {
    e.preventDefault()
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)

    paste.split('').forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char
      }
    })

    inputRefs.current[Math.min(paste.length - 1, 5)]?.focus()
  }

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault()

      if (!userData?._id) {
        return toast.error("User not loaded. Please login again.")
      }

      const otp = inputRefs.current.map(el => el?.value || '').join('')

      if (otp.length !== 6) {
        return toast.error('Please enter complete OTP')
      }

      const { data } = await axios.post(
        backendUrl + '/api/auth/verify-account',
        {
          otp,
          userId: userData._id
        }
      )

      if (data.success) {
        toast.success(data.message)
        await getUserData()
        navigate('/')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  // ✅ Prevent flicker before user loads
  if (!userData) return null;

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'>

      {/* Logo */}
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="logo"
        className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'
      />

      {/* Form */}
      <form
        onSubmit={onSubmitHandler}
        className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'
      >

        <h1 className='text-white text-2xl font-semibold text-center mb-4'>
          Email Verify OTP
        </h1>

        <p className='text-center mb-6 text-indigo-300'>
          Enter the 6-digit code sent to your email id.
        </p>

        {/* OTP Inputs */}
        <div className='flex justify-between mb-8' onPaste={handlePaste}>
          {Array(6).fill(0).map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              required
              className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md outline-none focus:ring-2 focus:ring-indigo-400'
              ref={el => inputRefs.current[index] = el}
              onInput={(e) => handleInput(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        {/* Button */}
        <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full hover:opacity-90 transition'>
          Verify Email
        </button>

      </form>
    </div>
  )
}

export default EmailVerify