require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const _ = require('lodash');
const date = require(__dirname + "/date.js")

const app = express();
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URL);
//storing typed values in an array
// var items = ["Buy Food", "Cook Food", "Eat Food"];
// var workListItems = [];
let lists=[];
const itemSchema = new mongoose.Schema({
  name: String,
});

const Item = new mongoose.model("Item", itemSchema);
const item1 = new Item({
  name: "Welcome to your todolist",
});
const item2 = new Item({
  name: "Hit the + button to add a new item",
});
const item3 = new Item({
  name: "<--Hit this to delete an item",
});

const defaultItems = [item1, item2, item3];
const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
});

const List = new mongoose.model("List", listSchema);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.get("/", function(req, res) {
  let day = date.getDate();
  List.find(function(err,foundItems){
    if(!err){
      while(!foundItems){
       res.redirect("/" + customListName);
      }
      lists=foundItems
    }
  });
  Item.find(function(err, foundItems) {
    if (err) {
      console.log(err);
    } else {
      if (foundItems.length === 0) {
        Item.insertMany(defaultItems, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log("successfully inserted default items to DB!")
          }
        });
        res.redirect("/");
      } else {
        res.render("list", {
          listTitle: day,
          newListItems: foundItems,
          lists:lists
        });
      }
    }
  })
  //renders the list.ejs file using the passed data

});

app.get("/:customListName", function(req, res) {
  const customListName = _.capitalize(req.params.customListName);
  List.find(function(err,foundItems){
    if(!err){
      while(!foundItems){
       res.redirect("/" + customListName);
      }
      lists=foundItems;
    }
  });
  List.findOne({
    name: customListName
  }, function(err, foundListDocument) {
    if (!err) {
      if (!foundListDocument) {
        //Create a new List
        if(customListName!=='Favicon.ico'){
          const listDocument = new List({
            name: customListName,
            items: defaultItems
          })
          listDocument.save();
          res.redirect("/" + customListName);
        }

      } else {
        //Render a existing list with default items
        res.render("list", {
          listTitle: customListName,
          newListItems: foundListDocument.items,
          lists:lists
        });
      }
    }
  })
})

app.post("/createList",function(req,res){
  let createdList=req.body.newList;
  res.redirect("/"+createdList);
})
app.get("/work", function(req, res) {
  res.render("list", {
    listTitle: "Work List",
    newListItems: workListItems
  });
});

app.get("/about", function(req, res) {
  res.render("about");
})
//Whenever we post something to the server(home route),it gets saved in a variable and pushes it to items array and again redirects to /
app.post("/", function(req, res) {
  let itemName = req.body.newItem;
  let listName = req.body.List;
  const listItem = new Item({
    name: itemName
  });
  if (listName === date.getDate()) {
    listItem.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listName
    }, function(err, foundListDocument) {
      if (!err) {
        foundListDocument.items.push(listItem);
        foundListDocument.save();
        res.redirect("/" + listName);
      }
    })

  }

  // if (req.body.List === "Work") {
  //   workListItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  // }
  // res.redirect("/");
})
app.post("/deleteList",function(req,res){
  let checkedListId=req.body.checkbox;
  List.findByIdAndRemove(checkedListId,function(err){
    if(err){
      console.log(err);
    }else{
      res.redirect("/");
    }
  })
})
app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;
  let listName = req.body.listName;
  console.log(req.body);
  if (listName === date.getDate()) {
    Item.findByIdAndRemove(checkedItemId, function(err) {
      if (err) {
        console.log(err);
      }
      res.redirect("/");
    });
  } else {
    List.findOneAndUpdate({
      name: listName
    }, {
      $pull: {
        items: {
          _id: checkedItemId
        }
      }
    }, function(err, foundList) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/" + listName);
      }
    });
  }

});

app.listen(3000, function() {
  console.log("Server is listening on port 3000");
});
