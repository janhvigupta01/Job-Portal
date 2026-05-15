import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { useDispatch } from "react-redux";
import { setSingleCompany } from "@/redux/companySlice";
import { Input } from "../ui/input";
import axios from "axios";
import { toast } from "sonner";

const CompanyCreate = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const dispatch = useDispatch();
  const registerNewCompany = async () => {
    try {
      const trimmedCompanyName = companyName.trim();

      if (!trimmedCompanyName) {
        toast.error("Company name is required");
        return;
      }

      const res = await axios.post(
        `${COMPANY_API_END_POINT}/register`,
        { companyName: trimmedCompanyName },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      if (res?.data?.success) {
        dispatch(setSingleCompany(res?.data?.company));
        toast.success(res?.data?.message);
        const companyId = res?.data?.company?._id;
        navigate(`/admin/companies/${companyId}`);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create company");
    }
  };
  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="my-10">
          <h1 className="font-bold text-xl sm:text-2xl">Your Company Name</h1>
          <p className="text-gray-500 text-sm sm:text-base">
            What would you like to give your company name? you can change this
            later.
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <Label>Company Name</Label>
            <Input
              type="text"
              className="my-2"
              placeholder="JobHunt, Microsoft etc."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 my-10">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/companies")}
            >
              Cancel
            </Button>
            <Button onClick={registerNewCompany}>Continue</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCreate;
