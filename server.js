
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb+srv://jarrodj:jarrodj@cluster0.yvouwuv.mongodb.net/?retryWrites=true&w=majority', {useUnifiedTopology: true}) 


.then(client => {
        console.log('Connected to database');
        const db = client.db('wow-character-data')
        const characterCollection = db.collection('characters')
        app.set('view engine', 'ejs') //renders the index.ejs inside of the views folder
        app.use(express.urlencoded({extended: true}))
        app.use(express.json())
        app.use(express.static('public')) // --->  any js/css files in the public folder will be automatically rendered
        
        // app.engine('html', require('ejs').renderFile);
        // app.set('view engine', 'html');
        
        app.engine('ejs', require('ejs').__express); 


        app.get('/', (req, res) => {
            db.collection('characters').find().toArray()
            .then(data => {
                console.log(data)
                res.render('index.ejs', {info: data})
            })
            .catch(error => console.error(error))
        })
        
        app.post('/addCharacter', (req, res) => {
            db.collection('characters').insertOne({charName: req.body.charName, charClass: req.body.charClass})
            .then(result => {
                if(!req.body.charName || !req.body.charClass){ //check if fields are empty
                   console.log('one or more of the fields is empty')
                    res.send('one or more of the fields is empty')
                }else{
                    console.log('Character added')
                    res.redirect('/')
                }
               
            })
            .catch(error => console.error(error))
        })


        
        app.listen(3000, () => {
            console.log(`Listening on port ${PORT}`)
        })

    })
    .catch(error => {
        console.error(error)
    })
