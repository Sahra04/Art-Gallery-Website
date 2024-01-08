const mongoose = require("mongoose");
const User = require("./UserModel");
const ArtWork = require("./ArtworkModel");
const fs = require("fs"); 


let user = []; 
let artworks = [];

mongoose.connect('mongodb://127.0.0.1/project', { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function () {

    //dropping database, so no overlaps with data, when reinititializing 
    await mongoose.connection.dropDatabase()
	console.log("Dropped database. Starting re-creation.");


    //reading input files, from art
    //storing in variable 
    fs.readdir("./public/art", function(err, files){
    if (err) throw err
    for(let i = 0; i < files.length; i++){
        let art = require("./public/art/" + files[i]);
        console.log(`${files[i]} has been loaded`);
        temp = art; 
    }
 
   for (let piece of temp){
        let exist = true; 
        for(let obj of user){
            if (obj.username === piece.Artist){
                exist = false; 
                break;   
            }
        }
        if (exist){
            let u = new User(); 
            u.username =  piece.Artist;
            u.artist = true; 
            user.push(u); 
        }

        let a = new ArtWork();
        a.title = piece.Title;
        a.artist = piece.Artist;
        a.year = piece.Year;
        a.category = piece.Category;
        a.medium = piece.Medium;
        a.description = piece.Description;
        a.poster = piece.Poster;

        artworks.push(a);
   }

  
   for (let piece of artworks){ 
    for(let obj of user){
        if (obj.username == piece.artist){
            obj.artpieces.push(piece)
        }
    }
   
   }
    console.log(user);
    let numberOfUser = 0;
	user.forEach(u => {
		u.save()
			.then(result => {
				numberOfUser++;
				if (numberOfUser >= user.length) {
					console.log("All users saved.");
				}
			})
			.catch(err => {
				throw err;
			})
    
        });

    let works = 0;
        artworks.forEach(a => {
            a.save()
                .then(result => {
                    works++;
                    if (works >= artworks.length) {
                        console.log("All artworks are saved.");
                    }
                })
                .catch(err => {
                    throw err;
                })
        
            });


    console.log("Database has been re-initialized");

    }); 

}); 
   

   

  


    
 