//create and send token and save in cookies.

const sendToken = (user, statusCode, res) => {
  // create jwt token
  const token = user.getJwtToken()

  const option = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  }
  res.status(statusCode).cookie('token', token, option).json({
    success: true,
    token,
    user,
  })
}
export default sendToken
