import React, { useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'

const Sidebar = () => {

  const { getUsers, users, selectedUser, setSelectedUser, unseenMessages,
    setUnseenMessages } = useContext(ChatContext);

  const { logout, onlineUser } = useContext(AuthContext)

  const [input, setInput] = useState("");

  const navigate = useNavigate()

  const filteredUsers = input ? users.filter((user) => user.fullName.toLowerCase().includes(input.toLowerCase())) : users;

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 max-sm:p-4 rounded-r-xl overflow-y-scroll text-white
      ${selectedUser ? 'max-md:hidden' : ''}`}
    >
      {/* ---------- TOP SECTION ---------- */}
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="logo" className="max-w-40 max-sm:max-w-32" />

          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="menu"
              className="max-h-5 max-sm:max-h-6 cursor-pointer min-w-[28px] min-h-[28px]"
            />

            <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block">
              <p
                onClick={() => navigate('/profile')}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p onClick={() => logout()} className="cursor-pointer text-sm">Logout</p>
            </div>
          </div>
        </div>

        {/* ---------- SEARCH ---------- */}
        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 max-sm:py-3.5 px-4 mt-5">
          <img src={assets.search_icon} alt="Search" className="w-3 max-sm:w-3.5" />
          <input
            onChange={(e) => setInput(e.target.value)}
            type="text"
            className="bg-transparent border-none outline-none text-white text-xs max-sm:text-sm placeholder-[#c8c8c8] flex-1"
            placeholder="Search User"
          />
        </div>
      </div>

      {/* ---------- USER LIST ---------- */}
      <div className="flex flex-col gap-1">
        {filteredUsers.map((user, index) => (
          <div
            key={index}
            onClick={() => {
              setSelectedUser(user);
              setUnseenMessages((prev) => ({
                ...prev,
                [user._id]: 0
              }));
            }}
            className={`relative flex items-center gap-2 p-2 pl-4 max-sm:p-3 max-sm:pl-4 cursor-pointer max-sm:text-sm
            transition-all duration-200
            ${selectedUser?._id === user._id
                ? 'bg-[#282142]/70 rounded-2xl ring-1 ring-violet-400/40'
                : 'rounded-lg hover:bg-[#282142]/30'
              }`}
          >
            {/* Avatar */}
            <img
              src={user?.profilePic || assets.avatar_icon}
              alt=""
              className="w-[35px] max-sm:w-[40px] aspect-[1/1] rounded-full"
            />

            {/* Name + Status */}
            <div className="flex flex-col leading-5">
              <p>{user.fullName}</p>
              {onlineUser.includes(user._id) ? (
                <span className="text-green-400 text-xs">Online</span>
              ) : (
                <span className="text-neutral-400 text-xs">Offline</span>
              )}
            </div>

            {/* Unread count */}
            {unseenMessages[user._id] > 0 && (
              <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">
                {unseenMessages[user._id]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
