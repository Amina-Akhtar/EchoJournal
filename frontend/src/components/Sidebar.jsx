import React, { use, useState } from 'react';
import { motion } from 'framer-motion';
import { FaHome, FaBell, FaChartLine, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { IoChatbubbleEllipses } from "react-icons/io5";
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { resetUserState } from '../store/userSlice';
import { useDispatch } from 'react-redux';
import axios from 'axios';
const navItems = [
  { name: 'Home', icon: <FaHome />, path: '/home' },
  { name: 'Community', icon: <IoChatbubbleEllipses/> , path: '/community' },
  { name: 'Updates', icon: <FaBell />, path: '/updates' },
  { name: 'Analytics', icon: <FaChartLine />, path: '/analytics' },
  { name: 'Profile', icon: <FaUser />, path: '/profile' }
];

export default function Sidebar() {
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch=useDispatch();
  const handleSignout = async (e) => {
    try {
      const response=await axios.post('http://localhost:5000/api/user/signout', {}, {
        withCredentials: true
      });
      dispatch(resetUserState());
      if(response.status==200)
     { toast.success('Signout successful!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate('/');}
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Signout failed!';
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }
  return (
    <div className="fixed left-0 top-0 h-screen w-20 bg-[#b3a0d9] flex flex-col justify-between py-6 z-50 shadow-lg">

      <div className="flex flex-col items-center justify-center space-y-6">
        {navItems.map((item, idx) => (
          <motion.div
            key={item.name}
            className="relative group cursor-pointer"
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => navigate(item.path)
            }
          >
            <motion.div
              className={`text-xl p-3 rounded-3xl transition-all duration-300 ${location.pathname === item.path
                ? 'bg-[#9c89c0] text-white shadow-md'
                : 'text-white'
                }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 1.05 }}
            >
              {item.icon}
            </motion.div>

            {hovered === idx && (
              <motion.div
                className="absolute left-15.5 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 backdrop-blur-sm text-[#b3a0d9] px-3 py-1.5 rounded-md whitespace-nowrap text-sm font-semibold shadow-lg border border-white border-opacity-20"
                initial={{ opacity: 0, x: -5 }}
                animate={{
                  opacity: 1,
                  x: 0
                }}
                exit={{ opacity: 0, x: -5 }}
              >
                {item.name}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center">
        <motion.div
          className="relative group cursor-pointer"
          onMouseEnter={() => setHovered('signout')}
          onMouseLeave={() => setHovered(null)}
          onClick={handleSignout}
        >
          <motion.div
            className={`text-xl p-3 rounded-3xl transition-all duration-300 ${location.pathname === '/logout'
              ? 'bg-[#9c89c0] text-white shadow-md'
              : 'text-white'
              }`} whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 1.05 }}
          >
            <FaSignOutAlt />
          </motion.div>

          {hovered === 'signout' && (
            <motion.div
              className="absolute left-15.5 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 backdrop-blur-sm text-[#b3a0d9] px-3 py-1.5 rounded-md whitespace-nowrap text-sm font-semibold shadow-lg border border-white border-opacity-20"
              initial={{ opacity: 0, x: -5 }}
              animate={{
                opacity: 1,
                x: 0
              }}
              exit={{ opacity: 0, x: -5 }}
            >
              Signout
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}