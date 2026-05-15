import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const Jobs = () => {
  // ✅ default empty array (important fix)
  const { allJobs = [], searchedQuery } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs);

  useEffect(() => {
    if (searchedQuery) {
      const filtered = allJobs.filter((job) => {
        const query = searchedQuery.toLowerCase().trim();
        const title = job.title?.toLowerCase().trim();
        const description = job.description?.toLowerCase().trim();
        const location = job.location?.toLowerCase().trim();

        // Handle different filter categories
        if (
          ["delhi ncr", "bangalore", "hyderabad", "pune", "mumbai"].includes(
            query,
          )
        ) {
          return location?.includes(query);
        } else {
          return (
            title?.includes(query) ||
            description?.includes(query) ||
            location?.includes(query)
          );
        }
      });
      setFilterJobs(filtered);
    } else {
      setFilterJobs(allJobs);
    }
  }, [allJobs, searchedQuery]);

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto mt-5 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-5">
          <div className="w-full md:w-1/4">
            <FilterCard />
          </div>

          {filterJobs.length === 0 ? (
            <div className="w-full md:w-3/4 text-center py-10">
              <span>Job not Found</span>
            </div>
          ) : (
            <div className="w-full md:w-3/4 h-[88vh] overflow-y-auto pb-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterJobs.map((job) => (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Job job={job} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
