import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { ChatContainer } from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'

const HomePage = () => {

  const [selectedUser, setSelectedUser] = useState(false)

  return (
    <div className="border w-full h-screen sm:px-[12%] sm:py-[5%]">
      <div
        className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-full grid grid-cols-1 relative
          ${
            selectedUser
              ? "md:grid-cols-[260px_1fr_260px]"
              : "md:grid-cols-[400px_1fr]"
          }
        `}
      >
        <Sidebar selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
        <ChatContainer selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
        <RightSidebar selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
      </div>
    </div>
  )
}

export default HomePage
