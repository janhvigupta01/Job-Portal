import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJob";

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  const skills = user?.profile?.skills || [];
  const isResume = Boolean(user?.profile?.resume);

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto border border-gray-200 rounded-2xl my-5 p-4 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 sm:h-24 sm:w-24">
              <AvatarImage src={user?.profile?.profilePhoto} alt="profile" />
            </Avatar>
            <div>
              <h1 className="font-medium text-lg sm:text-xl">
                {user?.fullname || "Full Name"}
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                {user?.profile?.bio || "No bio added yet."}
              </p>
            </div>
          </div>
          <Button
            onClick={() => setOpen(true)}
            className="mt-4 sm:mt-0"
            variant="outline"
          >
            <Pen className="w-4 h-4 mr-2" />
            Update
          </Button>
        </div>
        <div className="my-5">
          <div className="flex items-center gap-3 my-2">
            <Mail className="w-5 h-5" />
            <span className="text-sm sm:text-base">{user?.email || "NA"}</span>
          </div>
          <div className="flex items-center gap-3 my-2">
            <Contact className="w-5 h-5" />
            <span className="text-sm sm:text-base">
              {user?.phoneNumber || "NA"}
            </span>
          </div>
        </div>
        <div className="my-5">
          <h1 className="font-bold text-lg">Skills</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {skills.length !== 0 ? (
              skills.map((item, index) => (
                <Badge key={`${item}-${index}`}>{item}</Badge>
              ))
            ) : (
              <span>NA</span>
            )}
          </div>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label className="text-md font-bold">Resume</Label>
          {isResume ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={user?.profile?.resume}
              className="text-blue-500 w-full hover:underline cursor-pointer truncate"
            >
              {user?.profile?.resumeOriginalName || "Resume"}
            </a>
          ) : (
            <span>NA</span>
          )}
        </div>
      </div>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-4 md:p-0">
        <h1 className="font-bold text-lg my-5">Applied Jobs</h1>
        {/*Applied job Table*/}
        <AppliedJobTable />
      </div>
      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
