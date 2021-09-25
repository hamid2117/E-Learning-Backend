// const app = require('./app')
import app from './app.js'

// const port = 5000
const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} : http://localhost:${port}`
  )
})
