import React from "react";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();

  if (!job) {
    return null;
  }

  return (
    <div
      className="p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer"
      onClick={() => navigate(`/description/${job._id}`)}
    >
      <div>
        <h1 className="font-medium text-lg">
          {job?.company?.name || "Company Name"}
        </h1>
        <p className="text-sm text-gray-500">{job?.location || "Location"}</p>
      </div>
      <div>
        <h1 className="font-bold text-lg my-2">{job?.title || "Job Title"}</h1>
        <p className="text-sm text-gray-600 line-clamp-2">
          {job?.description || "No description available."}
        </p>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <Badge className="text-blue-700 font-bold" variant="ghost">
          {job?.position || 0} Positions
        </Badge>
        <Badge className="text-[#F83002] font-bold" variant="ghost">
          {job?.jobType || "NA"}
        </Badge>
        <Badge className="text-[#7209b7] font-bold" variant="ghost">
          {job?.salary ? `${job.salary} LPA` : "NA"}
        </Badge>
      </div>
    </div>
  );
};

export default LatestJobCards;
