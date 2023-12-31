const jwt = require('jsonwebtoken')
const db = require('./db')

// userDetails = {
//   1000: { acno: 1000, username: "Anu", password: "abc123", balance: 0, transaction: [] },
//   1001: { acno: 1001, username: "Amal", password: "abc123", balance: 0, transaction: [] },
//   1002: { acno: 1002, username: "Arun", password: "abc123", balance: 0, transaction: [] },
//   1003: { acno: 1003, username: "Akil", password: "abc123", balance: 0, transaction: [] }
// }

register = (uname, acno, psw) => {

  // if (acno in userDetails) {
  return db.User.findOne({ acno }).then(user => {
    if (user) {
      return {
        status: false,
        message: 'User already present',
        statusCode: 401
      }
    }
    else {
      // create a new user object in database
      const newuser = new db.User({
        acno,
        username: uname,
        password: psw,
        balance: 0,
        transaction: []
      })

      //save in db
      newuser.save()
      return {
        status: true,
        message: 'Register success',
        statusCode: 200
      }
    }
  })

}



login = (acno, psw) => {
  // if (acno in userDetails) {
  return db.User.findOne({ acno, password: psw }).then(user => {
    if (user) {
      currentUser = user.username
      currentAcno = acno

      const token = jwt.sign({ currentAcno }, "supersecretkey123")
      return {
        status: true,
        message: 'Login success',
        statusCode: 200,
        currentUser,
        currentAcno,
        token
      }
    }

    else {
      return {
        status: false,
        message: 'Incorrect account number or password',
        statusCode: 401
      }
    }
  })
}




deposit = (acnum, password, amount) => {
  //convert string amount to number-parseInt
  amnt = parseInt(amount)
  // if (acnum in userDetails) {
  return db.User.findOne({ acno: acnum, password }).then(user => {
    if (user) {
      user.balance += amnt
      user.transaction.push({ Type: "CREDIT", amount: amnt })
      user.save()
      return {
        status: true,
        message: `Amount ${amnt} is credited to your account and available balance is ${user.balance}`,
        statusCode: 200
      }
    }


    else {
      return {
        status: false,
        message: 'Incorrect account number or password',
        statusCode: 401
      }
    }
  })
}


withdraw = (acnum, password, amount) => {
  var amnt = parseInt(amount)
  return db.User.findOne({ acno: acnum, password }).then(user => {
    if (user) {
      if (amnt <= user.balance) {
        user.balance -= amnt
        user.transaction.push({ Type: "DEBIT", amount: amnt })
        user.save()
        return {
          status: true,
          message: `Amount ${amnt} is debited from your account and available balance is ${user.balance}`,
          statusCode: 200
        }
      }
      else {
        return {
          status: false,
          message: 'Insufficient balance',
          statusCode: 401
        }
      }
    }
    else {
      return {
        status: false,
        message: 'Incorrect account number or password',
        statusCode: 401
      }
    }
  })
}




getTransaction = (acno) => {
  return db.User.findOne({acno}).then(user=>{
    if(user){
      return {
        status: true,
        statusCode: 200,
        transaction: user.transaction
    
      }
    }
    
  })
  
}
deleteAcc=(acno)=>{
  return db.User.deleteOne({acno}).then(user=>{
    if(user){
      return {
        status:true,
        statusCode:200,
        message:'account deleted'
      }
    }
    else{
      return {
        status: false,
        message:'user not exist',
        statusCode:401

      }
    }
  })
}


module.exports = {
  register, login, deposit, withdraw, getTransaction,deleteAcc

}