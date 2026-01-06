import Doctor from "../models/doctor.model.js";

export const updateDocProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { licenseNumber, specialization, experience, fees } = req.body;
    const doctor = await Doctor.findOne({ userId });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor Profile not Found" });
    }
    if (licenseNumber !== undefined) doctor.licenseNumber = licenseNumber;
    if (specialization !== undefined) doctor.specialization = specialization;
    if (experience !== undefined) doctor.experience = experience;
    if (fees !== undefined) doctor.fees = fees;

    await doctor.save();

    res.status(200).json({
      message: "profile updated successfully",
      profile: doctor,
    });
  } catch (error) {
    console.log("Error updating patient profile:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getDocProfile = async(req,res)=> {
  try{
    const userId = req.user._id;
    const doctor = await Doctor.findOne({userId});

    if(!doctor){
      return res.status(404).json({message: "Doctor Account Not found"});
    }

    return res.status(200).json({
      message: "Doctor profile fetched successfully",
      profile: doctor,
    });
  } catch(error){
    console.log("Error fetching the profile", error.message);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
}

