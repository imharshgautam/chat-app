import React, { useContext, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { ChatContainer } from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { ChatContext } from '../../context/ChatContext'

const HomePage = () => {

  const {selectedUser} = useContext(ChatContext)

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
        <Sidebar/>
        <ChatContainer />
        <RightSidebar />
      </div>
    </div>
  )
}

export default HomePage
