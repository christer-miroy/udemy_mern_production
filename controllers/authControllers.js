import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, UnAuthenticatedError } from '../errors/index.js'
import attachCookie from '../utils/attachCookie.js'

const register = async (req, res) => {
    const { name, email, password } = req.body
    
    /* check for empty values */
    if (!name || !email || !password) {
        throw new BadRequestError('Please provide all values')
    }

    /* Duplicate Email */
     const userAlreadyExist = await User.findOne({email})
     if (userAlreadyExist) {
        throw new BadRequestError('Email already in use!')
     }

    const user = await User.create({ name, email, password })

    const token = user.createJWT() //create JWT

    attachCookie({res, token}) //add cookie

    res.status(StatusCodes.CREATED).json({
        user: {
            email: user.email,
            name: user.name,
            lastName: user.lastName,
            location: user.location,
        },
        location: user.location
    })
    
}

const login = async (req, res) => {
    const { email, password } = req.body
    
    /* check for empty values */
    if (!email || !password) {
        throw new BadRequestError('Please provide all values!')
    }

    /* check for user */
    const user = await User.findOne({ email }).select('+password')
    //.select('+password') = add password to the object
    if (!user) {
        throw new UnAuthenticatedError('Invalid credentials!')
    }

    /* check for password */
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new UnAuthenticatedError('Invalid credentials!')
    }

    const token = user.createJWT()

    user.password = undefined //remove the password from response
   
    attachCookie({res, token}) //token as cookie

    /* send back user, token, and location */
    res.status(StatusCodes.OK).json({
        user,
        location: user.location
    })
}

const updateUser = async (req, res) => {
    const { email, name, lastName, location } = req.body

    /* check for values */
    if (!email || !name || !lastName || !location) {
        throw new BadRequestError('Please provide all values!')
    }

    /* find user by id and update the fields */
    const user = await User.findOne({_id: req.user.userId})
    user.email = email
    user.name = name
    user.lastName = lastName
    user.location = location

    await user.save()

    /* create new JWT */
    const token = user.createJWT()

    attachCookie({res, token})

    /* send back user, token, and location */
    res.status(StatusCodes.OK).json({
        user,
        location: user.location
    })
}

/* refresh page without logging out the current user */
const getCurrentUser = async (req, res) => {
    const user = await User.findOne({_id: req.user.userId})
    res.status(StatusCodes.OK).json({
        user,
        location: user.location
    })
}

/* logout user */
const logout = async (req, res) => {
    res.cookie('token', 'logout', {
        HttpOnly: true,
        expires: new Date(Date.now()),
    })
    res.status(StatusCodes.OK).json({ msg: 'User Logged Out!'})
}

export {
    register,
    login,
    updateUser,
    getCurrentUser,
    logout
}