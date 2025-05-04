import Course from "../models/Course.js";
//get all courses
export const getAllCourse = async (req, res) =>{
  try{
    const courses = await Course.find({isPublished:true}).select(['-courseContent','-enrolledStudent']).populate({path: 'educator'})
    console.log('Courses:', courses);

    res.json({success: true, courses})
  } catch (error){
    res.json({success: false, message: error.message})
  }
}

//get course by id
export const getCourseId = async (req, res) =>{
  const {id} = req.params
  try {
    const courseData = await Course.findById(id).populate({path: 'educator'})

    //remove lecture url if preview is false
    courseData.courseContent.forEach(chapter => {
      chapter.chapterContent.forEach(lecture => {
        if(!lecture.isPreviewFree){
          lecture.lectureUrl = "";
        }
      })
    })

    res.json({success: true, courseData})
  } catch (error) {
    res.json({success: false, message: error.message})
  
  }
}

