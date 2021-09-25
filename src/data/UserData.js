import bcrypt from 'bcryptjs'

const user = [
  {
    name: 'Muhammad Usama',
    email: 'MuhammadUsama@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    address: 'samshabad Rawalpindi ',
    isAdmin: false,
    teacher: true,
    confirmation: true,
  },
  {
    name: 'Muhammad Hamid',
    email: 'hamid@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    address: 'H8 Islamabad',
    isAdmin: true,
    teacher: false,
    confirmation: true,
  },
]

export default user
