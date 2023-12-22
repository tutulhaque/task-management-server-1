const express = require('express');
const cors = require('cors');
require('dotenv').config()


const app= express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.z9xqo9p.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API 
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const taskCollection = client.db('taskManagement').collection('task');
    // Send a ping to confirm a successful connection

    // task Query
     app.get('/tasks', async(req,res) => {
        const cursor = taskCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })
    app.get('/task/:id', async(req,res)=> {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await taskCollection.findOne(query);
        res.send(result);

    })

    app.post('/tasks', async (req, res) => {
        const newTask = req.body;
        const result = await taskCollection.insertOne(newTask);
        res.send(result);
    })

    app.delete('/delete-task/:id', async(req,res)=> {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await taskCollection.deleteOne(query);
      res.send(result);
  })


    app.put('/task/:id', async(req,res) => {
      const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const options = {upsert:true};
        const updatedTask = req.body;
        const task = {
            $set:{
              title: updatedTask.title,
              priority: updatedTask.priority,
              description:updatedTask.description,
              deadline:updatedTask.deadline,
            }
        }
        const result = await taskCollection.updateOne(filter,task,options)
        res.send(result);

    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res) => {
    res.send("Fashion and apprearl making server is running")
})
app.listen(port, () => {
    console.log(`Fashion Server is running on port: ${port}`)

})