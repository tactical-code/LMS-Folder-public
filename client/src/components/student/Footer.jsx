import React from 'react'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <footer className='bg-gray-900 md:px-36 text-left w-full mt-10'>
      <div className='flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-white/30'>
        <div className='flex flex-col md:items-start items-center w-full'>
          <p className='w-18 lg:w-32 text-green-500 font-bold text-2xl'>LearnCept.com</p>
          {/* <img src={assets.logo_dark} alt="logo" /> */}
          <p className='mt-6 text-center md:text-left text-sm text-white/80'>A user-friendly course platform with structured learnsets—empowering creators to build, market, and sell educational content effortlessly.</p>
        </div>
        <div className='flex flex-col md:items-start items-center w-full'>
          <h2 className='font-semibold text-white mb-5'>Company</h2>
          <ul className='flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2'>
            <li><a href="#">Home</a></li>
            <li><a href="#">About us</a></li>
            <li><a href="#">Contact us</a></li>
            <li><a href="#">Privacy policy</a></li>
          </ul>
        </div>
        <div className='hidden md:flex flex-col items-start w-full'>
          <h2 className='font-semibold text-white mb-5'>Subscribe to our news letter</h2>
          <p className='text-sm text-white/80'>Get the latest news, articles, and resources delivered to your inbox every week.</p>
          <div className='flex items-center gap-2 pt-4'>
            <input type="email" placeholder='Enter your email' className='border border-gray-500/30 bg-gray-800 text-gray-500 placeholder-gray-500 outline-none w-64 rounded px-2 text-sm h-9'/>
            <button className='bg-green-600 w-24 h-9 text-white rounded'>Subscribe</button>
          </div>
        </div>
      </div>
      <p className='py-4 text-center text-xs md:text-sm text-white/80'>Copyright 2025 @AmbujVerma. All Right Reserved.</p>
    </footer>
  )
}

export default Footer