//blogApp
var express  = require("express"),
	mongoose = require("mongoose"),
	app 	 = express();

//connect to the db
mongoose.connect("mongodb://localhost:27017/blogApp", { useNewUrlParser: true });

// mongoose depriciation warning workarounds
//read more @ https://mongoosejs.com/docs/deprecations.html
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

//utilize built in body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//allow express to serve files from public folder
app.use(express.static("public"));

// monoose model config
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);


// RESTFUL routes

//landing page
app.get("/", function(req, res){
	res.render("home.ejs");
});

//INDEX
//show all blogs
app.get("/blogs", function(req, res){
	Blog.find({}, function(error, blogs){
		if(error){
			console.log(error);
		} else {
			res.render("index.ejs", {blogs: blogs});
		}
	});
});

//NEW
app.get("/blogs/new", function(req, res){
	res.render("new.ejs");
});

//CREATE
app.post("/blogs", function(req, res){
	//associate form elements with req data
	const title = req.body.title;
	const image = req.body.image;
	const body = req.body.body;
	const newCombo = {title: title, image: image, body: body};
	//create new blog
	Blog.create(newCombo, function(error, newBlog){
		console.log(newBlog);
		if(error){
			res.render("new.ejs");
		} else {
			//redirect defaults to get request
			res.redirect("/blogs");
		}
	});
});

//SHOW
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(error, blogDetail){
		if(error){
			console.log(error);
			res.redirect("/blogs");
		} else {
			res.render("show.ejs", {blog: blogDetail});
		}
	});
});
//initial create new blog post based on schema
// Blog.create({
// 	title: "Test Blog",
// 	image: "https://live.staticflickr.com/5026/5661473686_bde347b63e.jpg",
// 	body: "Baked Haddock",
	
		
// });


app.listen(3000, function(){
	console.log("Blog App Server listening on PORT 3000");
});

