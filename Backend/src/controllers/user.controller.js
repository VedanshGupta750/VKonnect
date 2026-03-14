import { User } from "../models/user.model.js";
import httpStatus from "http-status";
import bcrypt from "bcrypt"
import crypto from "crypto";

//register path
const register = async(req , res) =>{
    const {name , username , password} = req.body;

    try{
        const existingUser = await User.findOne({
            username
        });
        if(existingUser){
            return res.status(httpStatus.FOUND).json({
                message: "User Already Exist"
            })
        }
        const hashedPassword = await bcrypt.hash(password , 10);

        const newUser = new User({
            name: name,
            username: username,
            password: hashedPassword
        })
        await newUser.save();
        res.status(httpStatus.CREATED).json({
            message: "New User Registered Successfully"
        })

    }catch(e){
        res.json(`Someting went wrong ${e}`)
    }
}


const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username or password is not entered!" });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "User not Found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      let token = crypto.randomBytes(20).toString("hex");

      user.token = token;
      await user.save();

      return res.status(httpStatus.OK).json({
        token: token,
        message: "User has logged in Successfully!",
      });
    } else {
      return res.status(401).json({ message: "Invalid Password" });
    }

  } catch (e) {
    res.status(500).json({ message: `Something went wrong ${e}` });
  }
};  

export {login ,register}