import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Background from './Background';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import dayjs from 'dayjs';
import { updateNotification } from '../store/notificationSlice';

function Updates() {
  const dispatch = useDispatch();
  const [updates, setUpdates] = useState([]);
  const username = useSelector((state) => state.user.username) || 'User';

  useEffect(() => {
    axios.get(`http://localhost:5000/api/notifications/${username}`, { withCredentials: true })
      .then(res => {
        const formatted = res.data.map(n => ({
          id: n._id,
          user: n.userId?.username || 'Unknown',
          postText: n.postId?.text || 'Untitled',
          time: dayjs(n.timestamp).format('dddd h:mm A'),
          type: n.type,
          isRead: n.isRead
        }));
        setUpdates(formatted);
      })
      .catch(err => console.error('Failed to load notifications', err));
  }, [username]);

  const readNotification = async (id) => {
    try {
      const res = await axios.patch(`http://localhost:5000/api/notifications/${id}`, {}, {
        withCredentials: true
      });
      setUpdates(prev =>
      prev.map(n =>
        n.id === id ? { ...n, isRead: true } : n
      )
    );
    dispatch(updateNotification(res.data));
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  }

  return (
    <div className="relative z-0 h-screen overflow-hidden">
      <div className="ml-15 absolute top-0 left-0 w-full h-full z-0">
        <Background />
      </div>

      <div className="flex h-full relative z-10">
        <Sidebar />

        <main className="ml-20 w-full h-full overflow-y-auto px-6 py-8 sm:px-12">
          <div className="max-w-md mx-auto mb-6">
            <div className="flex flex-col items-center px-4 py-1">
              <h1 className="text-4xl font-bold text-[#5d4a7a]">Updates</h1>
            </div>
          </div>

          <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#b3a0d9] to-transparent mb-8 opacity-60" />

          <div className="max-w-4xl mx-auto space-y-3">
            {updates.map((update, index) => (
              <motion.div
                onClick={() => readNotification(update.id)}
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02, boxShadow: '0 10px 15px rgba(0,0,0,0.3)' }}
                transition={{ delay: 0.2 * index, duration: 0.5 }}
                className={`flex border border border-gray-300 rounded-xl px-6 py-5 shadow-md hover:shadow-lg transition
                 ${ update.isRead
                  ? 'bg-white '
                  : 'bg-[#b3a0d9]'  }
                `}
              >
                <div className="w-3/4 pr-4 flex flex-col justify-center">
                  <p className="text-black text-large">
                    <strong>{update.user}</strong>  {update.type} your post '{update.postText.trim().split(/\s+/).slice(0, 10).join(' ')} ...'
                  </p>
                </div>

                <div className="w-1/4 flex items-center justify-end">
                  <p className="text-s text-gray-400">{update.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Updates;
