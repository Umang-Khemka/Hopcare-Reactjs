import Patient from "../models/patient.model.js";
import Doctor from "../models/doctor.model.js";

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const { age, gender, weight,height } = req.body;

    const patient = await Patient.findOne({ userId });
    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }
    if (age !== undefined) patient.age = age;
    if (gender !== undefined) patient.gender = gender;
    if (weight !== undefined) patient.weight = weight;
    if(height !== undefined) patient.height = height;

    await patient.save();

    res.status(200).json({
      message: "Profile updated successfully",
      profile: patient,
    });
  } catch (error) {
    console.log("Error updating patient profile:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getProfile = async(req,res)=> {
  try{
    const userId = req.user._id;

    const patient = await Patient.findOne({userId});
    if(!patient){
      return res.status(404).json({message: "patient profile not found"});
    }
    return res.status(200).json({
      message: "Patient profile fetched success",
      profile: patient,
    });

  } catch(error){
    console.log("Error fetching the profile", error.message);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

export const getAllDoctors = async(req,res)=> {
  try{
    const doctors = await Doctor.find().populate("userId", "name email").select("specialization experience fees licenseNumber");

    res.status(200).json({
      message: "Doctors Data send",
      count: doctors.length,
      doctors,
    })
  } catch(error){
    console.log("Error fetching the doctor info", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};