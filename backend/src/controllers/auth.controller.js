import User from '../models/User.js';
import bcrypt from 'bcryptjs'
import { generateToken } from '../lib/utils.js';
import { sendWelcomeEmail } from '../emails/emailHandler.js';
import cloudinary from '../lib/cloudinary.js'
export const signup = async (req, res) => {
    const { name, email, password } = req.body; 
   try {
    if(!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    if(password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email address' });
    }
    const existingUser = await User.findOne({ email });
    if(existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const newUser = await User.create({ name, email, password: hashedPassword });
    if(newUser){
        generateToken(newUser._id, res)

        res.status(201).json({ 
            _id: newUser.id,
            name: newUser.name, 
            email: newUser.email,
            profilePicture: newUser.profilePicture
         });
         try{
            await sendWelcomeEmail('machiavellian2333@gmail.com', newUser.name, process.env.CLIENT_URL)
         }catch(error){
            console.log('unable to send email', error)
         }
    } else{
        res.status(400).json({message: "invalid user"})
    }
    
   } catch (error) {

    res.status(500).json({ message: error.message });
   }
}

export const login = async (req, res) => {
    const {email, password} = req.body 

    try {
        const user = await User.findOne({email})
        if(!user) return res.status(400).json({message: 'invalid credentials'})
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect) return res.status(400).json({message: 'invalid credentials'})
        generateToken(user.id, res)
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture
        })
        
    }catch(e){
        console.error('error logging in', e)
        res.status(500).json({message: 'internal server error'})
    }
}

export const logout =  (_, res) => {
    res.cookie('jwt', '', {maxAge:0})
    res.status(200).json({message: 'logout successful'})
}


export const updateProfile =  async (req, res) => {
   try {
    const {profilePicture} = req.body 
    if(!profilePicture) return res.status(400).json({message: 'profile pic is required'})
    const userId = req.user._id
    const uploadResponse = await cloudinary.uploader.upload(profilePicture)
    console.log('upload response', uploadResponse)
    const updatedUser =  await User.findByIdAndUpdate(userId, {profilePicture: uploadResponse.secure_url})
    res.status(200).json(updatedUser)
   }catch(e){
    console.log('error in update profile middleware', e)
}
}