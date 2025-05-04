import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export const Loading = () => {


  const {path} = useSearchParams()
  const navigate = useNavigate();

  useEffect(()=>{
    if(path){
      const timer = setTimeout(()=>{
        navigate(`/${path}`)
      }, 5000)
      return ()=> clearTimeout(timer);
    }
  },[])

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='w-16 sm:w-20 aspect-square border-4 border-gray-300 border-t-4 border-t-blue-400 rounded-full animate-spin'></div>
    </div>
  )
}

export default Loading
