import React, { useEffect, useState } from "react";
import { JobFeedSection } from "@/components/FindJob/JobFeedSection";
import { JobFilterSection } from "@/components/FindJob/JobFilterSection";
import { JobListingsSection } from "@/components/FindJob/JobListingsSection";
import api from "@/config/axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react"; 

export const FindJobPage = () => {
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [jobsBuffer, setJobsBuffer] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState({
    categories: [],
    paymentTypes: [],
    prices: [],
    distances: [],
  });

  const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/jobs/nearby');
        setJobsBuffer(res.data);
        setFilteredJobs(res.data); 
      } catch (error) {
        console.error("Lỗi tải danh sách việc:", error);
        toast.error("Không thể tải danh sách công việc.");
      } finally {
        setIsLoading(false);
      }
  };

  useEffect(() => {
       fetchData();
  }, []);

  const handleFilterChange = (type, values) => {
    setFilters((prev) => ({
      ...prev,
      [type]: values,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      categories: [],
      paymentTypes: [],
      prices: [],
      distances: [],
    });
    setFilteredJobs(jobsBuffer); 
    toast.success("Đã xóa bộ lọc");
  };

  const applyFilters = () => {
    setIsLoading(true);
   

    setTimeout(() => {
        let result = [...jobsBuffer]; console.log(result)
        if (filters.categories.length > 0) {
          result = result.filter((job) => 
            job.category && filters.categories.includes(job.category)
          );
        }

        if (filters.paymentTypes.length > 0) {
            result = result.filter((job) => 
                filters.paymentTypes.includes(job.paymentType)
            );
        }

        if (filters.prices.length > 0) {
          result = result.filter((job) => {
            return filters.prices.some((rangeLabel) => {
              const price = job.price || 0;
              if (rangeLabel === "Dưới 100k") return price < 100000;
              if (rangeLabel === "100k - 500k") return price >= 100000 && price <= 500000;
              if (rangeLabel === "500k - 1 triệu") return price > 500000 && price <= 1000000;
              if (rangeLabel === "Trên 1 triệu") return price > 1000000;
              return false;
            });
          });
        }

        if (filters.distances.length > 0) {
          result = result.filter((job) => {
            const dist = job.distance || 0; 
            return filters.distances.some((distLabel) => {
              if (distLabel === "Dưới 2km") return dist <= 2;
              if (distLabel === "2km - 5km") return dist > 2 && dist <= 5;
              if (distLabel === "5km - 10km") return dist > 5 && dist <= 10;
              if (distLabel === "Trên 10km") return dist > 10;
              return false;
            });
          });
        }

        setFilteredJobs(result);
        setIsLoading(false);
        toast.info(`Tìm thấy ${result.length} công việc phù hợp`);
    }, 0);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">

      <JobFeedSection />
      
      <JobFilterSection 
        currentFilters={filters}
        onFilterChange={handleFilterChange}
        onApply={applyFilters}
        onReset={handleResetFilters}
      />

      <div className="flex-1 container mx-auto px-4 py-8">
        {isLoading ? (
    
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-purple-600">
                <Loader2 className="w-10 h-10 animate-spin" />
                <p className="text-sm font-medium">Đang tải dữ liệu...</p>
            </div>
        ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                 <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">
                        Danh sách công việc đang mở
                    </h2>
                    <span className="text-sm font-medium px-3 py-1 bg-white border rounded-full text-gray-600 shadow-sm">
                        Kết quả: {filteredJobs.length}
                    </span>
                 </div>
                 
                 <JobListingsSection 
                    jobs={filteredJobs} 
                    onJobChange={fetchData} 
                 />

                 {filteredJobs.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                        <p className="text-4xl mb-2">🕵️‍♀️</p>
                        <p className="text-gray-500 font-medium">Không tìm thấy công việc nào phù hợp.</p>
                        <button 
                            onClick={handleResetFilters}
                            className="mt-4 text-purple-600 hover:underline text-sm"
                        >
                            Xóa bộ lọc để xem tất cả
                        </button>
                    </div>
                 )}
            </div>
        )}
      </div>
    </div>
  );
};