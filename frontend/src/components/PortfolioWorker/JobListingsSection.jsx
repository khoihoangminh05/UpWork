
import JobCard from "./JobCard";
import { Card } from "../ui/card";
export const JobListingsSection = ({jobListings, onChange}) => {


  return (
    <div className="flex flex-col p-2 gap-4">
      {jobListings.map((job) => (
        <JobCard
          key={job._id}
          job={job}
          handleJobChange={onChange}
        />
      ))
      }
    </div> 
  );
};