import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "../../utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { setLoading } from "@/redux/authSlice";

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: null,
  });
  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] || null });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res?.data?.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  });
  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <form
            onSubmit={submitHandler}
            className="bg-white shadow-md rounded-lg p-8"
          >
            <h1 className="font-bold text-2xl mb-5 text-center">Sign Up</h1>

            <div className="my-4">
              <Label>Full Name</Label>
              <Input
                type="text"
                value={input.fullname}
                onChange={changeEventHandler}
                name="fullname"
                placeholder="John Doe"
              />
            </div>

            <div className="my-4">
              <Label>Email</Label>
              <Input
                type="email"
                value={input.email}
                onChange={changeEventHandler}
                name="email"
                placeholder="johndoe@gmail.com"
              />
            </div>

            <div className="my-4">
              <Label>Phone Number</Label>
              <Input
                type="text"
                value={input.phoneNumber}
                onChange={changeEventHandler}
                name="phoneNumber"
                placeholder="123-456-7890"
              />
            </div>

            <div className="my-4">
              <Label>Password</Label>
              <Input
                type="password"
                value={input.password}
                onChange={changeEventHandler}
                name="password"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between my-4">
              <RadioGroup
                className="flex items-center gap-4"
                onValueChange={(value) => setInput({ ...input, role: value })}
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    id="r1"
                    onChange={changeEventHandler}
                  />
                  <Label htmlFor="r1">Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="role"
                    value="recruiter"
                    id="r2"
                    onChange={changeEventHandler}
                  />
                  <Label htmlFor="r2">Recruiter</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="my-4">
              <Label>Profile Photo</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={changeFileHandler}
                name="file"
              />
            </div>

            {loading ? (
              <Button className="w-full my-4" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button className="w-full my-4" type="submit">
                Sign Up
              </Button>
            )}

            <p className="text-center mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
