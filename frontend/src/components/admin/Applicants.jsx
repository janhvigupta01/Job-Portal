import React, { useEffect } from "react";
import Navbar from "../shared/Navbar";
import ApplicantsTable from "./ApplicantsTable";
import {
  APPLICATION_API_END_POINT,
  COMPANY_API_END_POINT,
} from "@/utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { setAllApplicants } from "@/redux/applicationSlice";

const Applicants = () => {
  const params = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const { applicants } = useSelector((store) => store.application);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        let res;
        if (location.pathname.includes("/admin/jobs")) {
          res = await axios.get(
            `${APPLICATION_API_END_POINT}/${params.id}/applicants`,
            { withCredentials: true },
          );
          if (res && res.data) {
            dispatch(setAllApplicants(res.data.job.applications));
          }
        } else if (location.pathname.includes("/admin/companies")) {
          res = await axios.get(
            `${COMPANY_API_END_POINT}/${params.id}/applicants`,
            { withCredentials: true },
          );
          if (res && res.data) {
            dispatch(setAllApplicants(res.data.applicants));
          }
        }
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };
    fetchApplicants();
  }, [params.id, location.pathname, dispatch]);

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="font-bold text-xl my-5">
          Applicants ({applicants?.length || 0})
        </h1>
        <ApplicantsTable />
      </div>
    </div>
  );
};

export default Applicants;
