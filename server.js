const express = require('express');
let app = express(); 
const session = require('express-session');
app.use(express.static("public"));
app.use(express.json()); 
app.set("view engine", "pug"); 
app.set("views","./public/views/pages" );
app.use('/public', express.static('public', { 'extensions': ['html', 'js'] }));
const mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1/project');

//using three mongoose schemes
const User = require("./UserModel");
const ArtWork = require("./ArtworkModel");
const Workshop = require("./WorkshopModel");

let db = mongoose.connection;

//this object is used for sessions
let users = {

};


//where session is stored
app.use(session({
	secret: 'some secret here',
	resave: true,
	saveUninitialized: true

}));  

//methods that are used
//auth used in every get method to check if the user is valid
app.get("/welcome", auth, admin); 
app.get("/logout", auth, logout);
app.get("/profile/:user", auth, profile);
app.get("/search", auth, search); 
app.get("/artwork/:ID", auth, viewArtwork); 
app.get("/artist/:name", auth, viewArtist );
app.get("/addartwork", auth, check, addArtwork);
app.get("/browseArtist", auth, browseArtist)
app.post("/addartwork", duplicates, newArtwork); 
app.post("/change", accountChange); 
app.get("/addworkshop", auth, check, addWorkshop);
app.post("/addworkshop", newWorkshop);
app.post("/enroll", enrolled); 
app.post("/follow", follow); 
app.post("/like", like); 
app.post("/review", review);


//authorization function
function auth(req, res, next) {
	//check if there a loggedin property set for the session, and
	//if they have admin rights
	if (!req.session.loggedin) {
		res.status(401).send("Logged out or Unauthorized");
		return;
	}
	next();
}

//once logged in, user is welcomed
function admin(req, res, next) {
	res.render("welcome", {username: req.session.username}); 
	return;
}

//displays a specific users profile page
function profile(req, res, next) {

	User.find({"username": req.session.username })
	.then(results => {
		res.render("profile", {username: req.session.username, artist : req.session.artist, user: results[0]})
		
		
	})
	.catch(err => {
		res.status(500).send("Error from database.");
		console.log(err);
	});
    


}

//display search page for searching 
function search(req, res, next) {
	res.render("search", {username: req.session.username})

}

//search based on a combination of category/artist/title
app.post("/search", function  (req, res){
	for(const obj in req.body){
		if(req.body[obj] === ''){
			delete req.body[obj]; 
		}

	}

	ArtWork.find(req.body)
	.then(results => {
		res.status(201).json(results);
		
	})
	.catch(err => {
		res.status(500).send("Error from database.");
		console.log(err);
	});
	

});


//display artwork page for specific artwork
function viewArtwork(req, res, next){
	const ID = req.params.ID
	ArtWork.findById(ID)
	.then(results => {
		res.render("artwork", {artpiece: results, username: req.session.username});  
	})
	.catch(err => {
		res.status(500).send("Error from database.");
		console.log(err);
	});
    
}


//display artist page for specific artist
function viewArtist(req, res, next){
	const artistName = req.params.name;
	User.find({"username": artistName})
	.then(results => {
		res.render("artist", {patron: req.session.username, workshops: results[0].workshops, artpieces: results[0].artpieces });
  
	})
	.catch(err => {
		res.status(500).send("Error from database.");
		console.log(err);
	});

}

//gives authority to user if they are an artist and not a patron...
//in order to access the add workshop and add artwork pages
function check(req, res, next){
	User.find({"username": req.session.username})
	.then(results => {
		if((results[0].artpieces.length != 0) && (results[0].artist === false)){
			res.status(401).send("Unauthorized access");
		}
		else{
			next();

		}
      
	})
	.catch(err => {
		console.log(err);
		throw err;	
	});
}

// displays the add artwork page
function addArtwork(req, res, next){
	res.render("addArtwork", { username: req.session.username, artist: req.session.artist });

}

//displays the addworkshop page
function addWorkshop(req, res, next){
	res.render("addWorkshop", { username: req.session.username});

}

//diplays the page where you can click the link to an artist to be directed to their page
function browseArtist(req, res, next){
		User.find()
		.then(results => {
			res.render("browseartist", { user: results, username: req.session.username});

		})
		.catch(err => {
			res.status(500).send("Error getting from database.");
			console.log(err);
		});
		

}

//adds workshop according to the user
//notifications field gets updated here
function newWorkshop(req, res, next){
	let w = new Workshop;
	w.title=req.body.title;
	w.artist = req.session.username;
	w.save(); 
	User.findOneAndUpdate({ "username": req.session.username}, {$push: {"workshops" : w}})
	.then(results => {
		// adding notifications to followers when new workshop is made
		const notification = `${req.session.username} added a new workshop`
		User.updateMany({ "username": {$in: results.followers }}, { $push: {"notification": notification }})
		.then(result => {
			res.status(201).json({username:req.session.username}); 
			
		})
		.catch(err => {
			res.status(500).send("Error updating to database.");
			console.log(err); 
		});
		
      
	})
	.catch(err => {
		res.status(500).send("Error updating to database.");
		console.log(err);
	});

}

//where users enroll to a workshop
function enrolled(req, res, next){
	Workshop.findOneAndUpdate({ "artist": req.body.artist, "title":req.body.title}, {$push: {"enrolled" : req.session.username}}, {new: true})
	.then(results => {
		User.findOneAndUpdate({"workshops._id": results._id}, {"$set": {"workshops.$": results}})
		.then(results => {
			res.status(201).send("successful");
		})
		.catch(err => {
			res.status(500).send("Error updating to database.");
			console.log(err);
		});
		
	})
	.catch(err => {
		res.status(500).send("Error updating to database.");
		console.log(err);
	});

}


//finds if the artist name and artist title are duplicates...
//does proper error handling in this case
function duplicates(req, res, next){
	if(req.body.artist != req.session.username){
		res.status(401).send("the artist should match your username");
		return; 
	}
	ArtWork.find({"title":req.body.title })
	.then(results => {
		if(results.length != 0){
			res.status(401).send("no duplicated artist titles");
			return; 
		}
		next();	
      
	})
	.catch(err => {
		res.status(500).send("Error from database.");
		console.log(err);
	});
	

}

//adds new artwork after the duplicate check is valid
//notifications field gets updated here
function newArtwork(req, res, next){
	let artpieces = new ArtWork(); 
	artpieces.title = req.body.title;
	artpieces.artist = req.body.artist;
	artpieces.year = req.body.year;
	artpieces.category = req.body.category;
	artpieces.medium = req.body.medium;
	artpieces.description = req.body.description;
	artpieces.poster = req.body.poster;
	artpieces.save()
		.then(artpiece => {
			User.findOneAndUpdate({ "username": req.body.artist}, {$push: {"artpieces" : artpiece}, $set: {"artist": true }})
			.then(result => {
				req.session.artist = true;
				//add notifications to followers when new artwork is made
				const notification = `${req.session.username} added a new artwork`
				User.updateMany({ "username": {$in: result.followers }}, { $push: {"notification": notification }})
				.then(result => {
					res.status(201).json({username:req.session.username}); 		
				})
				.catch(err => {
					res.status(500).send("Error updating to database.");
					console.log(err); 
				});
			})
			.catch(err => {
				res.status(500).send("Error saving to database.");
				console.log(err); 
			});

		}); 
	

	}

//allows user to change to patron or artist
function accountChange(req, res, next){
	User.findOneAndUpdate({ "username": req.session.username}, { $set: {"artist": req.body.artist }})
			.then(result => {
				req.session.artist = req.body.artist;
				res.status(201).send("Account change successful"); 
			})
			.catch(err => {
				res.status(500).send("Error saving to database.");
				console.log(err); 
			});
}

//allows user to follow other artists
//also updates artist followers field
function follow(req, res, next){
	if(req.body.button === "follow"){
		User.findOneAndUpdate({ "username": req.session.username}, { $push: {"following": req.body.artist }})
		.then(result => {
			//adding followers for artist
			User.findOneAndUpdate({ "username": req.body.artist}, { $push: {"followers": req.session.username }})
			.then(result => {
				res.status(201).send("Account following is successful"); 
			})
			.catch(err => {
				res.status(500).send("Error updating to database.");
				console.log(err); 
			});
			
		})
			
		.catch(err => {
			res.status(500).send("Error updating to database.");
			console.log(err);
		});
		

	}else{
		User.findOneAndUpdate({ "username": req.session.username}, { $pull: {"following": req.body.artist }})
		.then(result => {
			//removing followers for artist
			User.findOneAndUpdate({ "username": req.body.artist}, { $pull: {"followers": req.session.username }})
			.then(result => {
				res.status(201).send("Account unfollowing is successful"); 
			})
			.catch(err => {
				res.status(500).send("Error updating to database.");
				console.log(err); 
			});
		
		})
		.catch(err => {
			res.status(500).send("Error updating to database.");
			console.log(err);
		});

	}

}

//allows user to like an artwork
function like(req, res, next){
	ArtWork.findOneAndUpdate({ "_id": req.body.artworkID}, {$inc: {"likes" : 1}})
	.then(results => {
		User.findOneAndUpdate({"username": req.session.username}, {$push: {"liked" :  {id: req.body.artworkID, poster: req.body.poster }}})
		.then(results => {
			res.status(201).send("like is successful");

		})
		.catch(err => {
			res.status(500).send("Error updating to database.");
			console.log(err); 
		});

	})
	.catch(err => {
		res.status(500).send("Error updating to database.");
		console.log(err); 
	});


}


//allows user to add a review
function review(req, res, next){
	console.log(req.body);
	ArtWork.findOneAndUpdate({ "_id": req.body.artworkID}, {$push: {"reviews" : req.body.review}})
	.then(results => {
		User.findOneAndUpdate({"username": req.session.username}, {$push: {"reviewed" :  {id: req.body.artworkID, poster: req.body.poster }}})
		.then(results => {
			res.status(201).send("review is successful");

		})
		.catch(err => {
			res.status(500).send("Error updating to database.");
			console.log(err);
		});

	})
	.catch(err => {
		res.status(500).send("Error updating to database.");
		console.log(err);
	});

}

	

// get request to home page, sends browser the login.pug file to display
app.get('/', function  (req, res){
    User.find({}).select('username password artist -_id')
    .then(results => {
        for(let i in results){
           const x= String(results[i].username)
        //add user to object in server 
          users[results[i].username] = {
                password: results[i].password,
                artist: results[i].artist
          };
            
        }	
	})
	.catch(err => {
		console.log(err);
		throw err;
		
	});
    
	res.render("login", {}); 
}); 

// get request to register page, sends browser the register.pug file to display
app.get('/register', function  (req, res){
    console.log(users);
	res.render("register", {}); 
}); 

//allows new user to register to web application
app.post('/register', function  (req, res){
    User.find({username: req.body.username })
    .then(results => {
		//console.log(results);
        let empty = true; 
        if(results.length !== 0){
            empty = false;
        }
        if(empty){
            let newUser = new User;
            newUser.username = req.body.username;
            newUser.password = req.body.password;
            newUser.save();
            //add user to object in server 
            users[req.body.username] = {
                password: req.body.password,
                artist: false
            };
            console.log("saved to database");
            res.status(201).send();
        }
        if(!empty){
            res.status(404).send();      
        }    
		
	})
	.catch(err => {
		throw err;
	});
    
}); 


//allows user to login if they have registered
app.post("/", function  (req, res){
    if (req.session.loggedin) {
		console.log("User is already Logged in")
		res.status(200).send("Already logged in.");
		return;
	}

    let username = req.body.username;
	let password = req.body.password;
	
	console.log("Logging in with credentials:");
	console.log("Username: " + req.body.username);
	console.log("Password: " + req.body.password);

    //checks if the users exists
	if (!users.hasOwnProperty(req.body.username)) {
		res.status(404).send("User not found"); 
		return;
	}
	let artist =users[req.body.username].artist;

    //the user exists. Lets authenticate them
	if (users[req.body.username].password === req.body.password) {
		req.session.loggedin = true; // user session loggedin value set to be true

		//We set the username associated with this session
		//On future requests, we KNOW who the user is
		//We can authorize based on who they are
		req.session.username = username; //we keep track of what user this session belongs to
		req.session.artist = artist; //we keep track if their artist 
		res.status(201).send("Logged in");
	} else {
		res.status(401).send("Not authorized. Invalid password.");
	}
}); 


//where user is logged out
function logout(req, res, next) {
	if (req.session.loggedin) {
		req.session.loggedin = false;
		req.session.username = undefined;
		res.status(200).send("Logged out.");
	} else {
		res.status(200).send("You cannot log out because you aren't logged in.");
	}
}



//checks on the connection for database
//also starts server connection 
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function() {

	app.listen(3000);
	console.log("Server listening at http://localhost:3000");
});
