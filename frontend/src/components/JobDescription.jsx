import React, { useEffect, useMemo, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

import { setSingleJob } from "@/redux/jobSlice";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_POINT } from "@/utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "./shared/Navbar";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const isInitiallyApplied =
    singleJob?.applications?.some(
      (application) =>
        application?.applicant?._id === user?._id ||
        application?.applicant === user?._id,
    ) || false;
  const [isApplied, setIsApplied] = useState(isInitiallyApplied);
  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();

  const applyJobHandler = async () => {
    try {
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        {},
        {
          withCredentials: true,
        },
      );
      if (res.data.success) {
        setIsApplied(true); // update the local state
        const updateSingleJob = {
          ...singleJob,
          applications: [...singleJob?.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updateSingleJob)); // help us to real time UI update
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to apply job");
    }
  };
  useEffect(() => {
    const fetchSingleJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.application.some(
              (application) => application.applicant === user?._id,
            ),
          ); // ensure the state is in sync with fetched data
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (jobId) {
      fetchSingleJobs();
    }
  }, [jobId, dispatch, user?._id]);

  const postedDate = useMemo(() => {
    if (!singleJob?.createdAt) return "NA";
    return new Date(singleJob.createdAt).toLocaleDateString();
  }, [singleJob?.createdAt]);

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto my-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <div className="w-full md:w-2/3">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="font-bold text-2xl md:text-3xl">
                  {singleJob?.title || "Job Title"}
                </h1>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge className={"text-blue-700 font-bold"} variant="ghost">
                    {singleJob?.position || 0} Positions
                  </Badge>
                  <Badge className={"text-[#F83002] font-bold"} variant="ghost">
                    {singleJob?.jobType || "NA"}
                  </Badge>
                  <Badge className={"text-[#7209b7] font-bold"} variant="ghost">
                    {singleJob?.salary ? `${singleJob.salary} LPA` : "NA"}
                  </Badge>
                </div>
              </div>
              <div className="hidden md:block">
                <Button
                  onClick={applyJobHandler}
                  disabled={isApplied}
                  className={`rounded-full ${isApplied ? "bg-gray-400" : "bg-[#7209b7]"}`}
                >
                  {isApplied ? "Applied" : "Apply Now"}
                </Button>
              </div>
            </div>
            <div className="my-4">
              <h1 className="border-b-2 pb-2 border-b-gray-300 font-medium text-lg">
                Job Description
              </h1>
              <p className="my-3 text-sm text-gray-600">
                {singleJob?.description || "No description available."}
              </p>
            </div>
            <div className="my-4">
              <h1 className="border-b-2 pb-2 border-b-gray-300 font-medium text-lg">
                Roles & Responsibilities
              </h1>
              <p className="my-3 text-sm text-gray-600">
                {singleJob?.responsibility || "No responsibilities listed."}
              </p>
            </div>
            <div className="my-4">
              <h1 className="border-b-2 pb-2 border-b-gray-300 font-medium text-lg">
                Qualifications
              </h1>
              <p className="my-3 text-sm text-gray-600">
                {singleJob?.qualification || "No qualifications listed."}
              </p>
            </div>
            <div className="md:hidden mt-4">
              <Button
                onClick={applyJobHandler}
                disabled={isApplied}
                className={`w-full rounded-full ${isApplied ? "bg-gray-400" : "bg-[#7209b7]"}`}
              >
                {isApplied ? "Applied" : "Apply Now"}
              </Button>
            </div>
          </div>
          <div className="w-full md:w-1/3 p-4 bg-white rounded-md shadow-md border border-gray-200">
            <h1 className="font-bold text-lg pb-2 border-b border-gray-300">
              About Company
            </h1>
            <div className="flex items-center gap-2 my-4">
              <img
                src={singleJob?.company?.logo}
                alt="company_logo"
                className="w-16 h-16 rounded-md"
              />
              <div>
                <h1 className="font-semibold text-lg">
                  {singleJob?.company?.name}
                </h1>
                <p className="text-sm text-gray-500">
                  {singleJob?.company?.location}
                </p>
              </div>
            </div>
            <div className="my-2">
              <p className="text-sm">
                <span className="font-semibold">Posted Date:</span> {postedDate}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Website:</span>{" "}
                <a
                  href={singleJob?.company?.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600"
                >
                  {singleJob?.company?.website}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
