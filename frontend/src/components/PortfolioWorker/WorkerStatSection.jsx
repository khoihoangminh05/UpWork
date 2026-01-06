import React, { useEffect, useState } from 'react'
import { Card } from '../ui/card'
import { Separator } from '../ui/separator';
import { cn } from '@/lib/utils';
import { JobListingsSection } from './JobListingsSection';
import api from '@/config/axios';
import { _visibleJobLimit } from '@/lib/data';
import ListPagination from '../ListPagination';

const ClientStatSection = () => {
  const [jobsBuffer, setJobsBuffer] = useState([]);
  const [open, setOpen] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
     fetchData();
  },[open]);

  const fetchData = async() => {
      const path = (open ? "/jobs/worker/my-jobs" : "/jobs/worker/my-completedjobs")
      const res = await api.get(path);
      setJobsBuffer(res.data);
      console.log(res);
  };

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
  
  const visibleJobs = jobsBuffer.slice(
    (page-1) * _visibleJobLimit,
    page * _visibleJobLimit
  )

  if (visibleJobs.length === 0) {
    handlePrev();
  }
  console.log(visibleJobs);

  const totalPages = Math.ceil(jobsBuffer.length / _visibleJobLimit);

  return (
    <div className="flex-1 m-2 h-screen">
    <Card className="flex-1">
       <div className="flex gap-4 ">
       <h3 
         className={cn("text-lg font-semibold py-3 pl-3 cursor-pointer inline-bock px-10 transition-all duration-200", open ? "border-b-1 border-success" : "")}
         onClick={() => setOpen(true)}
       >
         Current work
       </h3>
       <h3 
         className={cn("text-lg font-semibold py-3 pl-3 cursor-pointer inline-bock px-10 transition-all duration-200", !open ? "border-b-1 border-success" : "")}
         onClick={() => setOpen(false)}
       >
         Completed work
       </h3>
       </div>
       <Separator className="bg-gray-200" />
       
        <JobListingsSection
          jobListings={visibleJobs}
          onChange={fetchData}
        />

    </Card>
    <ListPagination 
         handleNext={handleNext}
         handlePrev={handlePrev}
         handlePageChange={handlePageChange}
         page={page}
         totalPages={totalPages}
        />
      </div>
  )
}

export default ClientStatSection