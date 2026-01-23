import { Edit, PlayCircle, Lock } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Lecture = ({ lecture, courseId, index }) => {
  const navigate = useNavigate();

  const goToUpdateLecture = () => {
    navigate(`/admin/course/${courseId}/lecture/${lecture._id}`);
  };

  return (
    <div className="bg-[#F7F9FA] dark:bg-[#1F1F1F] px-4 py-3 rounded-md my-3">
      <div className="flex items-start justify-between gap-4">
        {/* LEFT: TITLE + ACTIONS */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-gray-800 dark:text-gray-100">
              Lecture {index + 1}: {lecture.lectureTitle}
            </h1>

            <div className="flex items-center gap-3">
              {/* FREE / PRIVATE STATUS */}
              {lecture.isPreviewFree === true ? (
                <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  FREE
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                  <Lock size={12} />
                  PRIVATE
                </span>
              )}

              <Edit
                onClick={goToUpdateLecture}
                size={18}
                className="cursor-pointer text-gray-600 hover:text-blue-600"
              />
            </div>
          </div>
        </div>

        {/* RIGHT: SMALL VIDEO */}
        <div className="w-[220px]">
          {lecture.videoUrl ? (
            <video
              src={lecture.videoUrl}
              controls
              className="w-full h-[120px] object-cover rounded-md"
            />
          ) : (
            <div className="flex items-center gap-2 text-xs text-gray-500 h-[120px] justify-center border rounded-md">
              <PlayCircle size={16} />
              No video
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lecture;