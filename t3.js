const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connect to MongoDB using Mongoose
mongoose
  .connect(
    "mongodb+srv://Vanshk:Vansh%402005@unicode.t9odhz7.mongodb.net/Harry-Potter-Task",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((error) => {
    console.error("Connection error:", error);
  });

// Defines schema
const dataSchema = new mongoose.Schema({
  name: String,
  id: String,
  gender: String,
  house: String,
  wizard: Boolean,
});

// Model creation
const Data = mongoose.model("Data", dataSchema);

app.get("/ThankYou", (req, res) => {
  res.send("Your Data Has Been Successfully Submitted");
});

//Dtat upload
app.post("/data", (req, res) => {
  const data = new Data(req.body);
  data
    .save()
    .then((result) => {
      console.log(result);
      res.redirect("/ThankYou");
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("An error occurred while inserting data");
    });
});

// Data get
app.get("/data", (req, res) => {
  Data.find()
    .then((results) => {
      console.log(results);
      res.render("index.ejs", { data: results });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("An error occurred while retrieving data");
    });
});

// update
app.patch("/data", (req, res) => {
  const { id, name, gender, house, wizard } = req.body;

  Data.findOneAndUpdate(
    { id: '13027' }, // Assuming the ID to search is '13027'
    { name, id, gender, house, wizard },
    { new: true, upsert: true }
  )
    .then((result) => {
      if (result) {
        console.log("Updated document:", result);
        res.send("Data updated successfully");
      } else {
        res.status(404).send("Data not found");
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("An error occurred while updating data");
    });
});

// Delete data
app.delete("/data", (req, res) => {
  const { name } = req.body;

  Data.deleteOne({ name })
    .then((result) => {
      res.json("Deleted the data");
      console.log(result);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("An error occurred while deleting data");
    });
});

// Query parameters
app.get("/t3/query", (req, res) => {
  const { search, limit } = req.query;

  let query = {};
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  Data.find(query)
    .limit(Number(limit) || 0)
    .then((results) => {
      res.status(200).json(results);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("An error occurred while querying data");
    });
});

app.listen(8080, () => {
  console.log("Listening on port 8080");
});
