const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const UserSchema = require('./modules/userSchema')
module.exports.connect = function () {
  return new Promise(function (resolve, reject) {
    let db = mongoose.createConnection(process.env.MONGODB_CONN_STRING, {
      useNewUrlParser: true,
    })

    db.on('error', (err) => {
      reject(err) // reject the promise with the provided error
    })

    db.once('open', () => {
      User = db.model('users', UserSchema)
      resolve()
    })
  })
}

module.exports.registerUser = function (userData) {
  return new Promise(function (resolve, reject) {
    if (userData.password != userData.password2) {
      reject('Passwords do not match')
    } else {
      bcrypt
        .hash(userData.password, 10)
        .then((hash) => {
          // Hash the password using a Salt that was generated using 10 rounds

          userData.password = hash

          let newUser = new User(userData)

          newUser
            .save()
            .then(() => {
              resolve('User ' + userData.userName + ' successfully registered')
            })
            .catch((err) => {
              if (err.code == 11000) {
                reject('User Name already taken')
              } else {
                reject('There was an error creating the user: ' + err)
              }
            })
        })
        .catch((err) => reject(err))
    }
  })
}

module.exports.checkUser = function (userData) {
  return new Promise(function (resolve, reject) {
    User.find({ userName: userData.userName })
      .limit(1)
      .exec()
      .then((users) => {
        if (users.length == 0) {
          reject('Unable to find user ' + userData.userName)
        } else {
          bcrypt.compare(userData.password, users[0].password).then((res) => {
            if (res === true) {
              resolve(users[0])
            } else {
              reject('Incorrect password for user ' + userData.userName)
            }
          })
        }
      })
      .catch(() => {
        reject('Unable to find user ' + userData.userName)
      })
  })
}
