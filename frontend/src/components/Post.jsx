import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { FiUnlock ,FiLock} from "react-icons/fi";
import { BiImageAdd } from 'react-icons/bi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';

function Post({ onClose, onSave ,previousPost}) {

    const [isPublic, setIsPublic] = useState(previousPost?.isPublic || true);
    const [text, setText] = useState(previousPost?.text || '');
    const [imagePreview, setImagePreview] = useState(previousPost?.image || null);
    useEffect(() => {
    if (previousPost) {
      setText(previousPost.text);
      setImagePreview(previousPost.image);
      setIsPublic(previousPost.isPublic);
    }
  }, [previousPost]);
    const toggleVisibility = () => setIsPublic(!isPublic);
    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImagePreview(url);
            const data=new FormData();
            data.append('file', file);
            data.append('upload_preset', 'MindScribe');
            data.append('cloud_name', 'dzwamfbfp');
            const uploaded=await fetch("https://api.cloudinary.com/v1_1/dzwamfbfp/image/upload", {
                method: 'POST',
                body: data
            });
            const result=await uploaded.json();
            setImagePreview(result.url);
            //console.log(result.url);
        }
    };
    const removeImage = () => setImagePreview(null);
    const savePost = (text, imagePreview,isPublic) => {
        onSave({ text, imagePreview, isPublic });
         toast.success('Post saved successfully!', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                      });
        setText('');
        setImagePreview(null);
        setIsPublic(true);
        onClose();
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#f8f4fc] bg-opacity-90 rounded-2xl p-6 shadow-xl max-w-3xl w-full text-black"
            >
                <div className="flex flex-wrap gap-4 items-center mb-4">
                    <button
                        onClick={toggleVisibility}
                        className="flex items-center gap-2 px-4 py-2 bg-[#b3a0d9] text-black rounded-full font-medium hover:bg-[#9c89c0] transition"
                    >
                        {isPublic ? <FiUnlock /> : <FiLock />}
                        <span>{isPublic ? 'Public' : 'Private'}</span>
                    </button>

                    <label className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-[#b3a0d9] text-black rounded-full font-medium hover:bg-[#9c89c0] transition">
                        <BiImageAdd />
                        <span>Image</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </label>
                </div>

                <textarea
                    rows={5}
                    placeholder="Your thoughts"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full h-50 bg-white text-black p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#b3a0d9] resize-none"
                />
                {imagePreview && (
                    <div className="relative h-40">
                        <img
                            src={imagePreview}
                            alt="Image preview"
                            className="w-full h-full rounded-lg shadow-lg object-cover"
                        />
                        <button
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-[#ffffffdd] text-black p-1 rounded-full hover:text-red-500 transition"
                        >
                            <FaTimes size={16} />
                        </button>
                    </div>
                )}

                <div className="flex justify-end space-x-3 mt-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-300 text-black rounded-full font-medium hover:bg-gray-400 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {  if (!imagePreview || !text.trim()) {
                  toast.error('Please fill all the fields', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                  return;
                }savePost(text, imagePreview, isPublic) }}
                        className="px-6 py-2 bg-[#b3a0d9] text-black rounded-full font-medium hover:bg-[#9c89c0] transition"
                    >
                        Save
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

export default Post;
