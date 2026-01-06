import React, { useState } from "react";
import JobCard from "./JobCard";
import { Card } from "../ui/card";
import { visibleJobLimit } from "@/lib/data";
import ListPagination from "../ListPagination";
export const JobListingsSection = ({jobs, onJobChange}) => {

  const [page, setPage] = useState(1);


  const handleNext = () => {
      if (page < totalPages) {
        setPage((prev) => prev + 1);
      }
    };
  
    const handlePrev = () => {
      if (page > 1) {
        setPage((prev) => prev - 1);
      }
    };
  
    const handlePageChange = (newPage) => {
      setPage(newPage);
    };
    
    const visibleJobs = jobs.slice(
      (page-1) * visibleJobLimit,
      page * visibleJobLimit
    )
  
    if (visibleJobs.length === 0) {
      handlePrev();
    }
    console.log(visibleJobs);
  
    const totalPages = Math.ceil(jobs.length / visibleJobLimit);


  return (
    <div>
    <Card className="container w-200 border-1 rounded-xl flex flex-col p-6 gap-6"> 
      {visibleJobs.map((job) => (
        <JobCard
          key={job._id}
          job={job}
          handleJobChange={onJobChange}
        />
      ))
      }
    </Card>
    <ListPagination 
         handleNext={handleNext}
         handlePrev={handlePrev}
         handlePageChange={handlePageChange}
         page={page}
         totalPages={totalPages}
        />
    </div>
     
  );
};