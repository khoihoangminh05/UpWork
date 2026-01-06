import React, { useEffect, useState } from "react";
import { JobFeedSection } from "@/components/FindJob/JobFeedSection";
import { JobFilterSection } from "@/components/FindJob/JobFilterSection";
import { JobListingsSection } from "@/components/FindJob/JobListingsSection";
import api from "@/config/axios";

export const FindJobPage = () => {
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [jobsBuffer, setJobsBuffer] = useState([]);

  const fetchData = async() => {
      const res = await api.get('/jobs/nearby');
      setJobsBuffer(res.data);
      setFilteredJobs(res.data);
      console.log(res);
  };

  useEffect(() => {
       fetchData();
  },[]);

  const [filters, setFilters] = useState({
    categories: [],
    paymentTypes: [],
    prices: [],
    distances: [],
  });

  const handleFilterChange = (type, values) => {
    setFilters((prev) => ({
      ...prev,
      [type]: values,
    }));
  };
  console.log(filters);

  const applyFilters = () => {
    let result = jobsBuffer;

    if (filters.categories.length > 0) {
      result = result.filter((job) => filters.categories.includes(job.category.name));
    }

    if (filters.paymentTypes.length > 0) {
        result = result.filter((job) => filters.paymentTypes.includes(job.paymentType));
    }

    if (filters.prices.length > 0) {
      result = result.filter((job) => {
        return filters.prices.some((rangeLabel) => {
          if (rangeLabel === "Dưới 100k") return job.price < 100000;
          if (rangeLabel === "100k - 500k") return job.price >= 100000 && job.price <= 500000;
          if (rangeLabel === "500k - 1 triệu") return job.price > 500000 && job.price <= 1000000;
          if (rangeLabel === "Trên 1 triệu") return job.price > 1000000;
          return false;
        });
      });
    }

    if (filters.distances.length > 0) {
      result = result.filter((job) => {
        return filters.distances.some((distLabel) => {
          if (distLabel === "Dưới 1km") return job.distance <= 1;
          if (distLabel === "1km - 5km") return job.distance > 1 && job.distance <= 5;
          if (distLabel === "5km - 10km") return job.distance > 5 && job.distance <= 10;
          if (distLabel === "Trên 10km") return job.distance > 10;
          return false;
        });
      });
    }

    setFilteredJobs(result);
  };

  return (
    <div className="flex flex-col items-center pt-20 pb-0 px-0 relative bg-white min-h-screen">
      <JobFeedSection />
      
      <JobFilterSection 
        currentFilters={filters}
        onFilterChange={handleFilterChange}
        onApply={applyFilters}
      />

      <JobListingsSection jobs={filteredJobs} onJobChange={fetchData}/>
    </div>
  );
};