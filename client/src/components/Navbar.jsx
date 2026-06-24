import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {

  const navigate = useNavigate();

  const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContent);

  // 🔥 Send Verification OTP
  const sendVerificationOtp = async () => {
  try {
    axios.defaults.withCredentials = true;

    const { data } = await axios.post(
      backendUrl + '/api/auth/send-verify-otp',
      { userId: userData._id }   // ✅ THIS FIXES YOUR ERROR
    );

    if (data.success) {
      navigate('/email-verify');
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }

  } catch (error) {
    toast.error(error.message);
  }
};
console.log(userData);

  // 🔥 Logout
  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        backendUrl + '/api/auth/logout'
      );

      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);
        toast.success("Logged out successfully");
        navigate('/');
      }

    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className='w-full flex justify-between items-center px-6 sm:px-20 py-4 absolute top-0 z-50'>

      {/* Logo */}
      <img
        src={assets.logo}
        alt="logo"
        className='w-28 sm:w-32 cursor-pointer'
        onClick={() => navigate('/')}
      />

      {/* Right Section */}
      {userData ? (
        <div className='w-10 h-10 flex justify-center items-center rounded-full bg-black text-white relative group cursor-pointer'>

          {userData?.name?.[0]?.toUpperCase()}

          {/* Dropdown */}
          <div className='absolute hidden group-hover:block top-0 right-0 z-20 text-black rounded pt-10'>
            <ul className='list-none m-0 p-2 bg-gray-100 text-sm rounded shadow-lg'>

              {/* ✅ Verify Email */}
              {!userData?.isAccountVerified && (
                <li
                  onClick={sendVerificationOtp}
                  className='py-1 px-3 hover:bg-gray-200 cursor-pointer rounded'
                >
                  Verify Email
                </li>
              )}

              {/* ✅ Logout */}
              <li
                onClick={logout}
                className='py-1 px-3 hover:bg-gray-200 cursor-pointer rounded'
              >
                Logout
              </li>

            </ul>
          </div>

        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className='flex items-center gap-2 border border-gray-400 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition'
        >
          Login
          <img src={assets.arrow_icon} alt="" />
        </button>
      )}

    </div>
  );
};

export default Navbar;