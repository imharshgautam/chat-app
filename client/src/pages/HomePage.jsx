import React, { useContext, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { ChatContainer } from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { ChatContext } from '../../context/ChatContext'

const HomePage = () => {

  const { selectedUser } = useContext(ChatContext)

  return (
    <div className="border w-full h-screen sm:px-[12%] sm:py-[5%] max-sm:p-0">
      <div
        className={`backdrop-blur-xl border-2 max-sm:border-0 border-gray-600 rounded-2xl max-sm:rounded-none overflow-hidden h-full grid grid-cols-1 relative
          ${selectedUser
            ? "md:grid-cols-[260px_1fr_260px]"
            : "md:grid-cols-[400px_1fr]"
          }
        `}
      >
        <Sidebar />
        <ChatContainer />
        <RightSidebar />
      </div>
    </div>
  )
}

export default HomePage
