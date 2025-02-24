import bcrypt from "bcrypt";
import UserModal from "../model/User.js";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
    try{
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModal({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash
        })
        // I create a doc for save to user like const user = await doc.save() and from here get a passwordHash and all userData
        // properties and give this userData to res.status(200).json({...userData, token})
        const user = await doc.save()
        const token = jwt.sign({
                _id: user._id,
            },
            "secretKey",
            {
                expiresIn:'30d',
            },
        )

        const {passwordHash, ...userData} = user._doc

        res.status(200).json({
            ...userData,
            token
        })
    } catch (err){
        res.status(500).json({
            message: 'Some problems with signUp',
        })
    }
}



// Login
export const login = async (req,res) => {
    try{
        // Has a User ?
        const user = await UserModal.findOne({email: req.body.email});
        if (!user){
            res.status(404).json({
                message: 'User is not found'
            })
        }
        // Validation compare
        const isValidUser = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidUser) {
            res.status(400).json({
                message: 'Неверный пароль или почта'
            })
        }

        const token = jwt.sign(
            {
                _id: user._id
            },
            "secretKey",
            {
                expiresIn: '30d'
            }
        )

        const {passwordHash, ...userData} = user._doc

        res.status(200).json({
            ...userData,
            token
        })

    } catch (err) {
        console.log(err)
    }
}


export const getMe = async (req, res) => {
    try {
        const user = await UserModal.findById(req.userId)
        if (!user){
            return res.status(404).json({
                message: 'User is not found'
            })
        }

        const {passwordHash, ...userData} = user._doc;
        res.json(userData)
    } catch (err){
        console.log(err)
        res.status(500).json({
            message: err
        })
    }
}