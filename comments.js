//1
//Templates?Why do we need Templates?
//We know that a callback fun has only on res.send(),but it can have multiple res.write()
app.get("/",function (req,res){
  let today=new Date();
  if(today.getDay()===6||today.getDay()===0)
    res.write("<h1>yay!its the weekend</h1>");
  else
    res.write("<h1>Boo!its a working day</h1>" );
    res.write("<p>We have to work</p>" );
    res.send();
});
//Sending an entire html page with res.write() is very difficult
//So what we can do is we can use res.sendFile(__dirname+"/filename.html");
/*But what if we want to send diff html file based on the logic,so creating a whole bunch of html files like weekend.html,weekday.html
is a pain in the ass,so thats why we need to learn templating.*/
//A blog website has a thousand of html files,no one creates them manually

//2
//Creating your First EJS Templates
// EJS (Embedded JavaScript Templating) is one of the most popular template engines for JavaScript
// It also helps to embed JavaScript to HTML pages
//go to ejs.co>using ejs with express
//npm install ejs
//require ejs
app.set("view engine", "ejs"); //set view engine to ejs
//Setup a views folder with all ejs files in it.
//In html template/ejs file the variable is elclosed with a marker like this <%=kindOfDay%> ,and we pass its value from the server file
res.render("ejsfilename",{kindOfDay:value})

//3
//Running code inside ejs template(which is a html file)
<% %> //Scriptlet tag allows us to use only control flow statements(no output) inside ejs file,because its for only content
//We should always try to put logic in server file
//We should enclose each js line with scriplet tag
  <%if(kindOfDay=== "Saturday"||kindOfDay=== "Sunday"){%> //observe this,we havent used <%= %> for kindOfDay
    <h1 style="color:blue"> Its a <%=kindOfDay%></h1>
//4
//PASSING DATA FROM YOUR WEBPAGE TO YOUR SERVER
//Search date format in js in chrome
let today = new Date();
let options={
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}
let day=today.toLocaleDateString("en-US",options); //here locale is "en-US",it can be anything

//5
//SCOPE
//Scope of local variables is local,ie they can only be accessed inside that block only
//But there is some pecularity in js
if(true){    //this if block considered as soft wall
  var x=2;   //this will have global scope
  console.log(x);
}
console.log(x); //is possible,cuz we declared x using var keyword,
//So var will have global scope no matter where u declare it,this is only particular to js,it other programming lang var will behave normally
//So try to avoid var,the code is more predictable that way
//use let instead

//6
// ADDING PRE-MADE CSS STYLESHEETS TO YOUR WEBSITE
//when we link to the stylesheet normally it will show this error in console
Refused to apply style from 'http://localhost:3000/css/styles.css'
//Because our css/styles.css exits in the root of our project
//When we use express,it doesnt automatically serve all of the project files,infact it only serve up the main access point which we define in our
//package.json file as app.js and also the views folder,and ignores everything
//so the browser cant simply goes to http://localhost:3000/css/styles.css ,cuz this is a dynamic website
//In order to use any file by the browser,the server has to server it
file:///D:/Web%20Development/8)Drum%20Kit%20Starting%20Files/styles.css /*We cant simply replace all of the endpoint with localhost:3000*/
//We create a folder called public and put all the files that we want the server to serve in it
//We need to tell the location of static files
app.use(express.static("public"));

background-image: -webkit-linear-gradient(65deg, #A683E3 50%, #E4E9FD 50%);

.item:last-child {
  border-bottom: 0;
}

input:checked+p {
  text-decoration: line-through;
  text-decoration-color: #A683E3;
}

::placeholder {
  color: grey;
  opacity: 1;
}

//7
//Understanding Templating vs Layouts
//We can simply use the same ejs template for webpages the need the same functionality ,with some changes
//But the problem arises when we want to create pages that dont need the most of the exiting ejs file functionality
//So EJS provides Layout/Partials
//Create separate ejs files for the repeatitive code like header.ejs,footer.ejs
//to use that code in oter ejs files,simply put
<%-include('header')-%>
<%-include('footer')-%>
//
//8
//UNDERSTANDING NODE MODULE EXPORTS: HOW TO PASS FUNCTIONS AND DATA BETWEEN FILES
//create a new module called date.js,with the date format code
//In order to use one module/file inside another file we need to require it
//const date=require(__dirname+"/date.js")
//Inside each module we can access a js object called module which contains a info about that module.
//whenever we require a module,it tries to run all the code inside the module
//In module obj we have a key called exports with a js object as its value
exports: {}
module.exports.getDate=getDate; //Exporting  getDate fun from date.js file
module.exports.getDay=getDay;   //Exporting  getDay fun from date.js file
//exports.getDate=getDate;
//exports.getDay=getDay;   //Short cuts that we can use
exports:{ getDate: [Function: getDate], getDay: [Function: getDay] }
const date=require(__dirname+"/date.js")
//Now we can access those functions using date.getDate(),date.getDay()
//When we make an array const,we can reassign that variable to a new object,but we can actually push items it to it,
//It is one of the quirks of js
//So when we make an array const in js,it cant protect inside values getting changed by others

//1
// Providing MongoDB database to our todo app
//Create three default documents and insert them in ur items collections

//2
//Rendering Database items
//When user goes to homepage ,search the collection,if it is empty add default items and redirect to homepage else render the foundItems

//3
//Adding new items
listItem.save();

//4
//Deleting items from our items collection
//req.body.checkbox value is either on or off
<form  action="/delete" method="post">
  <div class="item">
    <input type="checkbox" name="checkbox" value="<%=item.id%>" onChange="this.form.submit()">
    <p><%=item.name%></p>
  </div>
</form>
//Here we are changing the value to set to the item id
Item.findByIdAndRemove(checkedItemId,function(err){
  if(err){
    console.log(err);
  }else{
    console.log("Item deleted successfully!");
    res.redirect("/");
  }
})

//5
//Creating custom lists using Express route parameters
app.get("/:customListName",function(req,res){
const customListName=req.params.customListName;

List.findOne({name:customListName},function(err,foundListDocument){
  if(!err){
    if(!foundListDocument){
      //Create a new List
      const listDocument=new List({
        name:customListName,
        list:defaultItems
      })
      listDocument.save();
      res.redirect("/"+customListName);
    }else{
      //Render a existing list with default items
      res.render("list", {
        listTitle: customListName,
        newListItems: foundListDocument.list
      });
    }
  }

})

//6
//Deleting a document from a nested collection
List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){
  if(err){
    console.log(err);
  }else{
    res.redirect("/"+listName);
  }
});
//it pulls document with _id:checkedItemId inside items Array

//Capitalize the routing parameter/customListName using lodash
_.Capitalize(string)

//7
//Deploying web apps with a Database
//http://localhost:3000,here http is the set of rules that govern how we transfer data across the internet to acess web webpages
//mongodb://localhost:27017,here  we are using the mongodb rules which determines how you can access data in a mongoDB Database
//depending on the isp they have strict rules regarding whether you can set up a server using your home internet plan
//here we use heroku to host our node js app,and mongoDB own cloud service called Atlas to host our Database

//How to setup MongoDB Atlas
