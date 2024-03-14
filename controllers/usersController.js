const User=require('../modal/UserSchema')
const getAllUsers= async (req,res)=>{
    const response=await User.find({});

    return res.status(200).json({users})
}

module.exports={getAllUsers}