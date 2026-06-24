import React, { useState, useRef } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const ResetPassword = () => {

  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [step, setStep] = useState(1)
  const [newPassword, setNewPassword] = useState('')
  const [otp, setOtp] = useState('')

  const inputRefs = useRef([])

  // STEP 1 → EMAIL SUBMIT
 const handleEmailSubmit = async (e) => {
  e.preventDefault()

  try {
    const res = await axios.post(
      'http://localhost:4000/api/auth/send-reset-otp',
      { email }
    )

    if (res.data.success) {
      alert("OTP sent to your email")
      setStep(2)
    } else {
      alert(res.data.message)
    }

  } catch (error) {
    console.log(error)
    alert("Something went wrong")
  }
}

  // STEP 2 → OTP SUBMIT
 const handleOtpSubmit = (e) => {
  e.preventDefault()

  const enteredOtp = inputRefs.current.map(input => input.value).join('')
  console.log("OTP:", enteredOtp)

  setOtp(enteredOtp)   // ✅ STORE OTP
  setStep(3)
}

  // STEP 3 → NEW PASSWORD SUBMIT
 const handlePasswordSubmit = async (e) => {
  e.preventDefault()

  try {
    const res = await axios.post(
      'http://localhost:4000/api/auth/reset-password',
      {
        email,
        otp,            
        newPassword
      }
    )

    if (res.data.success) {
      alert("Password reset successful")
      navigate('/login')
    } else {
      alert(res.data.message)
    }

  } catch (error) {
    console.log("ERROR:", error.response || error)
    alert(error.response?.data?.message || "Something went wrong")
  }
}

  // OTP INPUT HANDLING (same as yours)
  const handleInput = (e, index) => {
    const value = e.target.value

    if (!/^\d?$/.test(value)) {
      e.target.value = ''
      return
    }

    if (value && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

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

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'>

      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt=""
        className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'
      />

      {/* STEP 1 */}
      {step === 1 && (
        <form onSubmit={handleEmailSubmit} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>

          <h1 className='text-white text-2xl font-semibold text-center mb-4'>
            Reset password
          </h1>

          <p className='text-center mb-6 text-indigo-300'>
            Enter your registered email address
          </p>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="" className='w-3 h-3' />
            <input
              type="email"
              placeholder='Email id'
              className='bg-transparent outline-none text-white w-full'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>
            Submit
          </button>

        </form>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <form onSubmit={handleOtpSubmit} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>

          <h1 className='text-white text-2xl font-semibold text-center mb-4'>
            Enter OTP
          </h1>

          <div className='flex justify-between mb-8' onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                required
                className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
                ref={el => inputRefs.current[index] = el}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>

          <button type="submit" className='w-full py-2.5 bg-indigo-600 text-white rounded-full'>
            Verify OTP
          </button>

        </form>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <form onSubmit={handlePasswordSubmit} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>

          <h1 className='text-white text-2xl font-semibold text-center mb-4'>
            New Password
          </h1>

          <input
            type="password"
            placeholder='New Password'
            className='w-full px-4 py-2 mb-4 rounded bg-[#333A5C] text-white'
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />

          <button className='w-full py-2.5 bg-green-600 text-white rounded-full'>
            Reset Password
          </button>

        </form>
      )}

    </div>
  )
}

export default ResetPassword