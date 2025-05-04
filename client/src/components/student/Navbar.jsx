import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import {useClerk, UserButton, useUser} from '@clerk/clerk-react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'



function Navbar() {

  const {navigate, isEducator, backendUrl, setIsEducator, getToken} = useContext(AppContext)


  const isCourseListPage = location.pathname.includes('/course-list');

  const {openSignIn} = useClerk()
  const {user} = useUser()


  const becomeEducator = async ()=>{
    try {
      if(isEducator){
        navigate('/educator')
        return
      }
      const token = await getToken()
      const {data} = await axios.get(backendUrl + '/api/educator/update-role',{headers: {Authorization: `Bearer ${token}`}})
      /* console.log("👀 Educator role update response:", data); */
      if(data.success){
        setIsEducator(true)
        toast.success(data.message)
      }else {
        toast.error(data.message)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
      /* toast.error(data.message) */
    }
  }

  return (
    <div className={`flex item-center justify-between px-4 sm:px-4 md:px-4 lg:px-36 border-b border-gray-500 py-4 ${isCourseListPage ? 'bg-white' : 'bg-cyan-100/70'}`}>
      <p onClick={()=>navigate('/')} className='w-28 lg:w-32 cursor-pointer font-bold text-3xl text-green-600'>LearnCept.com</p>
      {/* <img onClick={()=>navigate('/')} src={assets.logo} alt="Logo" className='w-28 lg:w-32 cursor-pointer' /> */}
      <div className='hidden md:flex items-center gap-5 text-gray-500'>
        <div className='flex items-center gap-5'>
         { user && 
          <>
            <button onClick={becomeEducator}>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button>
            | <Link to='/my-enrollments'>MY Enrollments</Link>
          </>
        }
        </div>
        { user ? <UserButton></UserButton> :

        <button onClick={()=> openSignIn()} className='bg-green-600 text-white px-5 py-2 rounded-full'>Create Account</button>}
      </div>
      {/* For phone screen */}
      <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500'>
        <div className='flex items-center gap-1 sm:gap-2 max-sm:text-xs'>
          {user && 
            <>
              <button onClick={becomeEducator}>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button>
              <Link to='/my-enrollments'>MY Enrollments</Link>
            </>
          }
        </div>
        {
          user ? <UserButton></UserButton> : <button onClick={()=> openSignIn()}><img src={assets.user_icon || undefined} alt="User Icon" /></button>
        }
      </div>
    </div>
  )
}

export default Navbar