import jwt from 'jsonwebtoken'
import { UnAuthenticatedError } from "../errors/index.js"

const auth = async (req, res, next) => {
    const token = req.cookies.token

    /* check for cookies */
    if (!token) {
        throw new UnAuthenticatedError('Invalid Authentication')
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)     

        /* test user - restricted access */
        const testUser = payload.userId === '63778c3fb78f1f8c8116a4f2' //set testUser to true if userId is equal to the given id
        req.user = { userId: payload.userId, testUser }
        next()
    } catch (error) {
        throw new UnAuthenticatedError('Authentication Invalid!')
    }
}

export default auth