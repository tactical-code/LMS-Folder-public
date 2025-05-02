import React from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { CourseCard } from './CourseCard'
export const CoursesSection = () => {

  const {allCourses} = useContext(AppContext)

  return (
    <div>
      <h2>Learn from the best</h2>
      <p>Explore our top-rated courses in coding, design, business, wellness, and more—expertly crafted to deliver real results.</p>

      <div className='grid grid-cols-4 px-50 md:my-16 my-10 gap-4'>
        {allCourses.slice(0,4).map((course, index)=> <CourseCard key={index} course={course}/>)}
      </div>

      <Link to={'/course-list'} onClick={()=>scrollTo(0,0)} className='text-gray-500 bordr border-gray-500/30 px-10 py-3 rounded'>Show all courses</Link>

    </div>
  )
}

export default CoursesSection
