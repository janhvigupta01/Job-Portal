import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
export const register=async (req,res)=>{
    try {
        const { fullname, email, phoneNumber, phone, password, role } = req.body || {};
        const normalizedPhoneNumber = phoneNumber || phone;
        const normalizedEmail = email?.trim().toLowerCase();

        if(!fullname || !normalizedEmail || !normalizedPhoneNumber || !password || !role){
            return res.status(400).json({
                message:"Something is missing",
                success:false
            });
        };
        const user=await User.findOne({ email: normalizedEmail });
        if(user){
            return res.status(400).json({
                message:'User already exist with this email.',
                success:false
            })
        }
        const hashedPassword=await bcrypt.hash(password,10);
        
        let cloudResponse = null;
        const file = req.file;
        if (file) {
            const fileuri = getDataUri(file);
            cloudResponse = await cloudinary.uploader.upload(fileuri.content);
        }
        
        await User.create({
            fullname,
            email: normalizedEmail,
            phoneNumber: normalizedPhoneNumber,
            password:hashedPassword,
            role,
            profile:{
                profilePhoto: cloudResponse?.secure_url || "",
            }
            
        });
        return res.status(201).json({
            message:"Account created successfully",
            success:true,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Something went wrong during registration",
            success:false
        });
    }
}
export const login =async (req,res)=>{
    try {
        const {email,password,role}=req.body;
        const normalizedEmail = email?.trim().toLowerCase();

        if(!normalizedEmail || !password){
            return res.status(400).json({
                message:"Email and password are required",
                success:false
            });
        };
        let user=await User.findOne({ email: normalizedEmail });
        if(!user){
            return res.status(400).json({
                message:'Incorrect email or password',
                success:false,
            })
        }

        const isPasswordMatch=await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                message:'Incorrect email or password',
                success:false,
            })
        };
        // check role is correct or not 
        if(role && role !== user.role){
            return res.status(400).json({
                message:'Account does not exist with current role.',
                success:false,
            })
        };
        const tokenData={
            userId:user._id,
        }
        const token=await jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn:'7d'});
        user={
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile
        }
        return res.status(200).cookie("token",token,{maxAge:1*24*60*60*1000,httpOnly:true,sameSite:'strict'}).json({
            message:`Welcome back ${user.fullname}`,
            user,
            success:true,
        })
    } catch (error) {
        console.log(error);
    }
}

export const logout=async (req,res)=>{
    try {
        return res.status(200).cookie("token","",{maxAge:0,httpOnly:true,sameSite:'strict',path:'/'}).json({
            message:"Logged out successfully",
            success:true,
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateProfile=async (req,res)=>{
    try {
        const {fullname, email, phoneNumber, bio, skills} =req.body;
        const file=req.file;
        let cloudResponse = null;

        if (file) {
            const fileUri = getDataUri(file);
            cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                resource_type: "raw"
            });
        }


        let skillsArray;
        if(skills){
            skillsArray=skills.split(",").map((skill) => skill.trim()).filter(Boolean);
        }

        const userId=req.id; //middleware authentication
        let user=await User.findById(userId);
        if(!user){
            return res.status(400).json({
                message:"User not found",
                success:false,
            })
        }
        //updating data
        if(fullname)user.fullname=fullname;
        if(phoneNumber)user.phoneNumber=phoneNumber;
        if(email)user.email=email;
        if(bio)user.profile.bio=bio;
        if(skills)user.profile.skills=skillsArray;
        
       
        //resume comes later here...
        if(cloudResponse){
            user.profile.resume=cloudResponse.secure_url; //save the cloudinary url
            user.profile.resumeOriginalName = file.originalname // save the original file name
        }
        await user.save();
        user={
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile
        }
        return res.status(200).json({
            message:"Profile updated successfully.",
            user,
            success:true,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Unable to update profile",
            success:false,
        })
    }
}