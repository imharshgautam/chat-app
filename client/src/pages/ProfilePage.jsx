import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';

const ProfilePage = () => {

  const { authUser, updateProfile } = useContext(AuthContext)

  const [selectedImg, setSelectedImg] = useState(null)
  const navigate = useNavigate();
  const [Name, setName] = useState(authUser?.fullName || "")
  const [bio, setBio] = useState(authUser?.bio || "")

  useEffect(() => {
    if (authUser) {
      setName(authUser.fullName || "")
      setBio(authUser.bio || "")
    }
  }, [authUser])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImg) {
      await updateProfile({ fullName: Name, bio });
      navigate('/')
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfile({ profilePic: base64Image, fullName: Name, bio });
      navigate('/');
    }
  }

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center px-4'>
      <div className='w-full max-w-3xl backdrop-blur-2xl text-gray-300 border-2
      border-gray-600 flex items-center justify-between max-sm:flex-col-reverse
      rounded-lg'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 max-sm:p-6 flex-1'>
          <h3 className='text-lg'>Profile Details</h3>

          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <input
              onChange={(e) => { setSelectedImg(e.target.files[0]) }}
              type="file"
              id="avatar"
              accept='.png, .jpeg, .jpg'
              hidden
            />
            <img
              src={selectedImg ? URL.createObjectURL(selectedImg) : (authUser?.profilePic || assets.avatar_icon)}
              alt=""
              className={`w-12 h-12 rounded-full object-cover border-2 border-violet-400 ${selectedImg && 'rounded-full'}`}
            />
            upload profile image
          </label>

          <input
            onChange={(e) => setName(e.target.value)}
            value={Name}
            type="text"
            required
            placeholder='Your name'
            className='p-3 max-sm:p-3.5 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 bg-transparent text-white'
          />

          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder='Write profile bio'
            required
            className='p-3 max-sm:p-3.5 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 bg-transparent text-white'
            rows={4}
          ></textarea>

          <button
            type="submit"
            className='bg-gradient-to-r from-purple-400 to-violet-600 text-white p-3 max-sm:p-3.5 rounded-full text-lg cursor-pointer hover:opacity-90 transition'
          >
            Save
          </button>
        </form>

        <img
          className={`max-w-44 max-sm:max-w-32 aspect-square rounded-full mx-10 max-sm:mx-0 max-sm:mt-6 object-cover`}
          src={selectedImg ? URL.createObjectURL(selectedImg) : (authUser?.profilePic || assets.logo_icon)}
          alt=""
        />
      </div>
    </div>
  )
}

export default ProfilePage
