const express = require('express')
const app = express()
const Sequelize = require('sequelize')
const sequelize = new Sequelize('postgres://postgres:secret@localhost:5432/postgres', {define: { timestamps: false }})

const port = 4000
app.listen(port, () => `Listening on port ${port}`)

const House = sequelize.define('house', {
    title: Sequelize.STRING,
    description: Sequelize.TEXT,
    size: Sequelize.INTEGER,
    price: Sequelize.INTEGER
}, {
    tableName: 'houses'
})
  
House.sync() // this creates the houses table in your database when your app starts

House.findAll().then(houses => {
    console.log(`I found these houses: ${houses}`)
})

app.get('/houses', function (req, res, next) {
    House.findAll()
      .then(houses => {
        res.json({ houses: houses })
      })
      .catch(err => {
        res.status(500).json({
          message: 'Something went wrong',
          error: err
        })
      })
})

app.get('/houses/:id', function (req, res, next) {
    const id = req.params.id
    House.findById(id)
      .then(house => {
        res.json({ message: `Read house ${id}` })
      })
      .catch(err => {
        res.status(500).json({
          message: 'Something went wrong',
          error: err
        })
      })
})

const bodyParser = require('body-parser')
app.use(bodyParser.json())

app.post('/houses', function (req, res) {
  console.log('Incoming data: ', req.body)
  res.json({ message: 'Create a new house' })
})

House.create({
    title: 'Multi Million Estate',
    description: 'This was build by a super-duper rich programmer',
    size: 1235,
    price: 98400000
}).then(house => console.log(`The house is now created. The ID = ${house.id}`))

app.post('/houses', function (req, res) {
    House
      .create(req.body)
      .then(house => res.status(201).json(house))
      .catch(err => {
        res.status(500).json({
          message: 'Something went wrong',
          error: err
        })
      })
})

app.put('/houses/:id', function (req, res) {
    const id = req.params.id
    House.findById(id)
    //   .then(house => {
    //       res.json({ message: `Update house ${id}` })
    //   })
      .then(house => {
          house.update({
            title: 'Super Duper Million Dollar Mainson'
          })
            .then(house => {
                console.log(`The house with ID ${house.id} is now updated`, house)
                res.send(200).json(house) 
            })
        })
      .catch(err => {
        res.status(500).json({
            message: 'Something went wrong',
            error: err
        })
    })
})

app.delete('/houses/:id', function (req, res) {
    const id = req.params.id
    House.findById(id)
      .then(house => house.destroy(id))
      .catch(err => {
          res.status(500).json({
            message: 'Something went wrong',
            error: err
            })
        })
})