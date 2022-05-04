const express = require('express');

const { MongoClient, ServerApiVersion } = require('mongodb');
// single value r id r jonno
const ObjectId = require('mongodb').ObjectId;


const cors = require('cors');
require('dotenv').config()



const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wz4lj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        // eikhane console log kore dekhte hobe je database er sathe connect hoiche kina pass or user name vul thakle error massage dibe console a 
        console.log('connected to database')

        // databaser modde ami ki name database open korte chacchi and tar nam ki hobe

        const database = client.db("CarMechanic");
        const sevicesCollection = database.collection("services");

        // GET API
        app.get('/services', async (req, res) => {
            const cursor = sevicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // GET single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await sevicesCollection.findOne(query);
            res.json(service);
        })

        // post API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('post hitted', service)
            // const service = {
            //     "name": "ENGINE DIAGNOSTIC",
            //     "price": "300",
            //     "description": "Lorem ipsum dolor sit amet, consectetu radipisi cing elitBeatae autem aperiam nequ quaera molestias voluptatibus harum ametipsa.",
            //     "img": "https://i.ibb.co/dGDkr4v/1.jpg"
            // }

            const result = await sevicesCollection.insertOne(service);
            console.log(result)
            res.json(result)
        });

        // Delete API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await sevicesCollection.deleteOne(query);
            res.json(service);
        })


    }

    finally {
        // await client.close();
    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running car server');
})


app.listen(port, () => {
    console.log('car surver port', port);
})