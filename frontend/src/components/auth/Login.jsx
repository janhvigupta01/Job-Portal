import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "../../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const { loading, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setErrorMessage("");
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.email || !input.password) {
      toast.error("Please fill email and password");
      setErrorMessage("Please fill email and password");
      return;
    }

    dispatch(setLoading(true));

    try {
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
        setErrorMessage("");
      }
    } catch (error) {
      console.log(error);
      const apiMessage = error?.response?.data?.message || "Login failed";
      toast.error(apiMessage);
      setErrorMessage(apiMessage);
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
            <h1 className="font-bold text-2xl mb-5 text-center">Login</h1>

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

            {loading ? (
              <Button className="w-full my-4" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button className="w-full my-4" type="submit">
                Login
              </Button>
            )}

            {errorMessage && (
              <p className="text-red-500 text-sm mt-2 text-center">
                {errorMessage}
              </p>
            )}

            <p className="text-center mt-4">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-600 hover:underline">
                Signup
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
