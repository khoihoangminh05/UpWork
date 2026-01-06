import { CreateJobPostingSection } from "@/components/PostJob/CreateJobPostingSection";
import { JobDetailsSection } from "@/components/PostJob/JobDetailsSection";
import React from "react";

export const PostJobPage = () => {
  return (
    <div className="flex flex-col  items-center  pb-0 px-0 relative bg-white">
      <CreateJobPostingSection />
      <JobDetailsSection />
    </div>
  );
};