//blogApp
const methodOverride   = require("method-override"),
	  expressSanitizer = require("express-sanitizer"),
	  express  		   = require("express"),
	  mongoose 		   = require("mongoose"),
	  app 	 		   = express(),
	  port             = process.env.PORT || 3000;
	  
	

//App config
	//connect to the test/prod db. DB credentials were changed from previous commit.
mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true });

	// mongoose depriciation warning workarounds
	//read more @ https://mongoosejs.com/docs/deprecations.html
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

	//utilize built in body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

	//sanitizer
app.use(expressSanitizer());
	//allow express to serve files from public folder
// app.use(express.static("public"));
app.use(express.static(__dirname + "/public"));
	//POST parameter; will treat put requests as post request (put is not valid within HTML standard)
app.use(methodOverride("_method"));

// monoose model config
const blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

const Blog = mongoose.model("Blog", blogSchema);


// RESTFUL routes

//landing page
app.get("/", (req, res) => {
	res.redirect("/blogs");
});

//INDEX
//show all blogs
app.get("/blogs", (req, res) => {
	Blog.find({}, (error, blogs) => {
		if(error){
			console.log(error);
		} else {
			res.render("index.ejs", {blogs: blogs});
		}
	});
});

//NEW
app.get("/blogs/new", (req, res) => {
	res.render("new.ejs");
});

//CREATE
app.post("/blogs", (req, res) => {
	//associate form elements with req data
	const title = req.body.title;
	const image = req.body.image;
	const body = req.sanitize(req.body.body);
	const newCombo = {title: title, image: image, body: body};
	//create new blog
	Blog.create(newCombo, (error, newBlog) => {
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
app.get("/blogs/:id", (req, res) => {
	Blog.findById(req.params.id, (error, blogDetail) => {
		if(error){
			console.log(error);
			res.redirect("/blogs");
		} else {
			res.render("show.ejs", {blog: blogDetail});
		}
	});
});

//EDIT
app.get("/blogs/:id/edit", (req, res) => {
	//like a combo of new and show
	//first we need to drag the id out of the req, so that we can assign prefilled content and deliver it to tthe coorect blog entry within the db
	Blog.findById(req.params.id, (error, blogDetail) => {
		if(error){
			res.redirect("/blogs");
		} else {
			res.render("edit.ejs", {blog: blogDetail});
		}
	});
});

//UPDATE
//takes all form data (after user edits) and passes it through the find&update method. redirecting at blogs/id
//sanitize ignores <scripts> within body
app.put("/blogs/:id", (req, res) => {
	const title = req.body.title;
	const image = req.body.image;
	const body = req.body.body;
	const newCombo = {title: title, image: image, body: body};
	Blog.findByIdAndUpdate(req.params.id, newCombo, (error, updatedBlog) => {
		if(error){
			console.log(error);
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

//DELETE
//delete and redirect
app.delete("/blogs/:id", (req, res) => {
	Blog.findByIdAndRemove(req.params.id, (error) => {
		if(error){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs");
		}
	});
});


//initial create new blog post based on schema
// Blog.create({
// 	title: "Test Blog",
// 	image: "https://live.staticflickr.com/5026/5661473686_bde347b63e.jpg",
// 	body: "Baked Haddock",
	
		
// });


app.listen(port, function(){
	console.log("BBall BQQ Server Has Started!");
});

