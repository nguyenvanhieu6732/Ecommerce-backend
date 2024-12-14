const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()

const generalAccessToken = async (payload) => {
    const access_token = jwt.sign({
        ...payload
    }, process.env.ACCESS_TOKEN, { expiresIn: "60d" })

    return access_token
}

const generalRefreshToken = async (payload) => {
    const refresh_token = jwt.sign({
        ...payload
    }, process.env.REFRESH_TOKEN, { expiresIn: "365d" })

    return refresh_token
}

const refreshTokenJwtService = (token) => { // true
    return new Promise((resolve, reject) => {
        try {
            jwt.verify(token, process.env.REFRESH_TOKEN, async(err, user) => {
                if (err) {
                    resolve({
                        status: "ERR",
                        message: "the authentication"
                    })
                }
                const access_token = await generalAccessToken({
                    id: user?.id,
                    isAdmin: user?.isAdmin
                })
                resolve({
                    status: 'OK',
                    message: 'Success',
                    access_token
                })
            })
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    generalAccessToken,
    generalRefreshToken,
    refreshTokenJwtService
}
