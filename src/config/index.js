export const config = {
    accessTokenSecret: process.env.JWT_SECRET,
    accessTokenExpiration: '7d',
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET,
    refreshTokenExpiration: '30d',
}