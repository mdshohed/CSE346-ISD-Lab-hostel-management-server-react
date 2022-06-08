const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId, Collection } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.skthh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
    await client.connect();
    console.log('db connected'); 
    const userCollection = client.db('hostel_admin').collection('users');
    const studentCollection = client.db('hostel_admin').collection('students');

    // Students
    app.post('/student',async(req, res)=>{
      const student = req.body;
      console.log(student);
      const result = await studentCollection.insertOne(student);
      res.send({result, success: true});
    })
    app.get('/student', async(req, res)=>{
      const student = await studentCollection.find().toArray();
      res.send(student); 
    })
    app.delete('/student/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)}; 
      const result = await studentCollection.deleteOne(query);
      res.send(result);
    })

    //user 

    app.put('/user',async(req, res)=>{
      const email = req.params.email;
      console.log(email);
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send({ result });
    })

    app.get('/user', async(req, res)=>{
      const result = await userCollection.find().toArray(); 
      res.send(result); 
    })
  }
  finally{
    
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello From Hostel management!')
})

app.listen(port, () => {
  console.log(`hostel management port ${port}`)
})