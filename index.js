// import dataservice file
const dataService = require('./service/dataservice')

//import cors
const cors=require("cors")

// import json web token
const jwt = require('jsonwebtoken')

// import express
const express = require("express")

// create app using express
const app = express()

// connection string for front end integration
app.use(cors({origin:'http://localhost:4200'}))

// to parse json data from request body
app.use(express.json())

// middleware
const jwtMiddlewear = (req, res, next) => {
    try {
        const token = req.headers['access_token']
        // verify token
        const data = jwt.verify(token, "supersecretkey123")
        // console.log(data);
        next()
    }
    catch {
        res.status(422).json({
            statusCode: 422,
            status: false,
            message: "please login first"
        })
    }
}

// register - post
app.post('/register', (req, res) => {

    dataService.register(req.body.uname, req.body.acno, req.body.psw).then(result => {
        // convert object to json and send as response
        res.status(result.statusCode).json(result)

    })


    //    if(result){
    //     res.send("registered")
    //    }
    //    else{
    //     res.send("user aready exist")
    //    }

    // console.log(req.body);
    // res.send("success")
})

// login
app.post('/login', (req, res) => {

    dataService.login(req.body.acno, req.body.psw).then(result=>{
        // convert object to json and send as response
    res.status(result.statusCode).json(result)
    // console.log(req.body);
    // res.send("success")
})
    })

    


// deposit
app.post('/deposit', jwtMiddlewear, (req, res) => {
    // const result = dataService.deposit(req.body.acnum, req.body.password, req.body.amount)
     dataService.deposit(req.body.acnum, req.body.password, req.body.amount).then(result=>{
        res.status(result.statusCode).json(result)

    })
})

// withdraw
app.post('/withdraw', jwtMiddlewear, (req, res) => {

 dataService.withdraw(req.body.acnum, req.body.password, req.body.amount).then(result=>{
    res.status(result.statusCode).json(result)
 })
})
// getTransaction
app.post('/transaction', jwtMiddlewear, (req, res) => {
     dataService.getTransaction(req.body.acno).then(result=>{
        res.status(result.statusCode).json(result)

     })

})
// delete


// creating request 

// app.get('/',(req,res)=>{
//     res.send('Get Method....')
// })

// app.post('/',(req,res)=>{
//     res.send('Post Method....')
// })

// app.put('/',(req,res)=>{
//     res.send('Put Method....')
// })

// app.patch('/',(req,res)=>{
//     res.send('Patch Method....')
// })
// app.delete('/',(req,res)=>{
//     res.send('Delete Method....')
// })

//delete
app.delete('/delete/:acno',jwtMiddlewear,(req,res)=>{
    dataService.deleteAcc(req.params.acno).then(result=>{
        res.status(result.statusCode).json(result)
    })
})

// create port
app.listen(3000, () => { console.log("server started at port number 3000"); })

