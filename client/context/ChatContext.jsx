import { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import toast from 'react-hot-toast';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({})

    const {socket, axios} = useContext(AuthContext);

    // function to get all user form side bar

    const getUsers = async() =>{
        try {
           const {data} = await axios.get("/api/messages/users");
           if(data.success){
            setUsers(data.users)
            setUnseenMessages(data.unseenMessages)
           }
        } catch (error) {
            toast.error(error.message)
            
        }
    }

    // function to get messages for selected user 

    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);
            if (data.success) {
                setMessages(data.messages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    
    // function to send messages to selected user

    const sendMessage = async (messageData) => {
        if (!selectedUser) {
            toast.error("Please select a user to send message");
            return;
        }
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if (data.success) {
                setMessages((prevMessages) => [...prevMessages, data.newMessage]);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };


    // function to subscribe to message for selected user 

    useEffect(() => {
        if (!socket) return;
      
        const handleNewMessage = (newMessage) => {
          if (selectedUser && newMessage.senderId === selectedUser._id) {
            // Mark as seen and add to current chat
            newMessage.seen = true;
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            axios.put(`/api/messages/mark/${newMessage._id}`);
          } else {
            // Increment unseen message count for the specific sender
            setUnseenMessages((prevUnseenMessages) => ({
              ...prevUnseenMessages,
              [newMessage.senderId]: prevUnseenMessages[newMessage.senderId] 
                ? prevUnseenMessages[newMessage.senderId] + 1 
                : 1
            }));
          }
        };

        socket.on("newMessage", handleNewMessage);
        
        return () => {
          if (socket) socket.off("newMessage", handleNewMessage);
        };
    }, [socket, selectedUser]);
      
    const value = {
        messages,
        users,
        selectedUser,
        getUsers,
        getMessages,
        sendMessage,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};
