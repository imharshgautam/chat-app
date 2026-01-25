import React, { useContext, useEffect, useState } from 'react'
import assets, { imagesDummyData } from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'

const RightSidebar = () => {

  const {selectedUser, messages} = useContext(ChatContext)
  const {logout, onlineUser} = useContext(AuthContext)
  const [msgImages, setMsgImages] = useState([])

  // get all images from message and set them to state

  useEffect(()=>{
    if(messages && selectedUser) {
      setMsgImages(
        messages.filter(msg=>msg.image).map(msg=>msg.image)
      )
    }
  },[messages, selectedUser])

  return (
    selectedUser && (
      <div
        className={`bg-[#8185B2]/10 text-white w-full relative
        overflow-y-scroll pb-24 bg-center bg-cover
        ${selectedUser ? 'max-md:hidden' : ''}`}
      >
        {/* ---------- PROFILE ---------- */}
        <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt=""
            className="w-20 aspect-[1/1] rounded-full ring-2 ring-violet-400/30 shadow-lg"
          />

          <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
            {onlineUser.includes(selectedUser._id) && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
            {selectedUser.fullName}
          </h1>

          <p className="px-10 mx-auto text-center text-gray-300">
            {selectedUser.bio}
          </p>
        </div>

        <hr className="border-[#ffffff50] my-4" />

        {/* ---------- MEDIA ---------- */}
        <div className="px-5 text-xs">
          <p className="mb-2">Media</p>

          <div className="max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-90">
            {msgImages.map((url, index) => (
              <div
                key={index}
                onClick={() => window.open(url, '_blank')}
                className="cursor-pointer rounded-md overflow-hidden
                hover:scale-105 transition-transform duration-200"
              >
                <img
                  src={url}
                  alt=""
                  className="h-full w-full object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ---------- LOGOUT ---------- */}
        <button
          onClick={()=>logout()}
          className="absolute bottom-5 left-1/2 -translate-x-1/2
          bg-gradient-to-r from-purple-400 to-violet-600
          text-white text-sm font-light py-2 px-20
          rounded-full cursor-pointer hover:opacity-90 transition"
        >
          Logout
        </button>
      </div>
    )
  )
}

export default RightSidebar
