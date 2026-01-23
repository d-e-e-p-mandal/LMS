import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { useGetLectureByIdQuery } from "@/features/api/courseApi";
import LectureTab from "./LectureTab";

const EditLecture = () => {
  const { courseId, lectureId } = useParams();

  const {
    data,
    isLoading,
    isError,
  } = useGetLectureByIdQuery(lectureId);

  if (isLoading) {
    return <p className="mx-10">Loading lecture...</p>;
  }

  if (isError || !data?.lecture) {
    return <p className="mx-10">Failed to load lecture</p>;
  }

  return (
    <div className="mx-10">
      <div className="flex items-center gap-2 mb-5">
        <Link to={`/admin/course/${courseId}/lecture`}>
          <Button size="icon" variant="outline" className="rounded-full">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <h1 className="font-bold text-xl">Update Your Lecture</h1>
      </div>

      <LectureTab
        lecture={data.lecture}
        lectureId={lectureId}
        courseId={courseId}
      />
    </div>
  );
};

export default EditLecture;