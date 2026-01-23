// file: src/pages/admin/course/LectureTab.jsx

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  useEditLectureMutation,
  useGetLectureByIdQuery,
  useRemoveLectureMutation,
} from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const LectureTab = () => {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();

  /* ================= LOCAL STATE ================= */
  const [lectureTitle, setLectureTitle] = useState("");
  const [isPreviewFree, setIsPreviewFree] = useState(false);
  const [videoFile, setVideoFile] = useState(null);

  /* ================= API ================= */
  const { data, isLoading: lectureLoading } =
    useGetLectureByIdQuery(lectureId);

  const lecture = data?.lecture;

  const [
    editLecture,
    { isLoading: updateLoading, isSuccess: updateSuccess, error: updateError },
  ] = useEditLectureMutation();

  const [
    removeLecture,
    { isLoading: deleteLoading, isSuccess: deleteSuccess },
  ] = useRemoveLectureMutation();

  /* ================= PREFILL ================= */
  useEffect(() => {
    if (lecture) {
      setLectureTitle(lecture.lectureTitle || "");
      setIsPreviewFree(Boolean(lecture.isPreviewFree));
    }
  }, [lecture]);

  /* ================= FILE ================= */
  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setVideoFile(file);
  };

  /* ================= UPDATE ================= */
  const updateLectureHandler = async () => {
    if (!lectureTitle.trim()) {
      toast.error("Lecture title is required");
      return;
    }

    const formData = new FormData();
    formData.append("lectureTitle", lectureTitle);
    formData.append("isPreviewFree", isPreviewFree ? "true" : "false"); // ✅ FIX
    if (videoFile) formData.append("file", videoFile);

    await editLecture({ courseId, lectureId, formData });
  };

  /* ================= DELETE ================= */
  const deleteLectureHandler = async () => {
    await removeLecture(lectureId);
  };

  /* ================= EFFECTS ================= */
  useEffect(() => {
    if (updateSuccess) toast.success("Lecture updated successfully");
    if (updateError)
      toast.error(updateError?.data?.message || "Update failed");
  }, [updateSuccess, updateError]);

  useEffect(() => {
    if (deleteSuccess) {
      toast.success("Lecture removed");
      navigate(`/admin/course/${courseId}/lecture`);
    }
  }, [deleteSuccess, navigate, courseId]);

  if (lectureLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <Card>
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription>
            Update lecture details and upload video
          </CardDescription>
        </div>

        <Button
          variant="destructive"
          disabled={deleteLoading}
          onClick={deleteLectureHandler}
        >
          {deleteLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Removing
            </>
          ) : (
            "Remove Lecture"
          )}
        </Button>
      </CardHeader>

      <CardContent>
        <div className="mb-4">
          <Label>Lecture Title</Label>
          <Input
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="Introduction to JavaScript"
          />
        </div>

        <div className="mb-4">
          <Label>
            Video <span className="text-red-500">*</span>
          </Label>
          <Input type="file" accept="video/*" onChange={fileChangeHandler} />
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Switch
            checked={isPreviewFree}
            onCheckedChange={setIsPreviewFree}
          />
          <Label>Free Preview</Label>
        </div>

        <Button disabled={updateLoading} onClick={updateLectureHandler}>
          {updateLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving
            </>
          ) : (
            "Update Lecture"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default LectureTab;