
//allows user to go onto account and access the website, according if the user is valid
//sends username and password to server for verification
function login(){
    const username = document.getElementById('user').value;
    const password = document.getElementById('pass').value;

    
    const obj = {
        username: username,
        password: password
    }


    req = new XMLHttpRequest();
    
	req.onreadystatechange = function() {
        if(this.readyState==4 && this.status==201){
            alert("User is logged in!"); 
            window.location.href = `http://localhost:3000/welcome`; 

        }if(this.readyState==4 && this.status==404){
            alert("User Does not exist, try again");
            window.location.href = window.location.href;  
        }if(this.readyState==4 && this.status==401){
            alert("User Password is incorrect, try again");
            window.location.href = window.location.href;  
        }
    }


    req.open("POST", "/"); 
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(obj));

}

//post request to the server in order for the user to be checked to be saved to database
function register(){
    const username = document.getElementById('un').value;
    const password = document.getElementById('pd').value;

    const obj = {
        username: username,
        password: password
    }


    req = new XMLHttpRequest();
    
	req.onreadystatechange = function() {
        if(this.readyState==4 && this.status==201){
            alert("Registered!, Please now login"); 
            //if user does not exist on data base then new user was made, and now can go to login page
            window.location.href = `http://localhost:3000/`; 

        }if(this.readyState==4 && this.status==404){
            alert("Username already exists, try to register again");
            window.location.href = window.location.href;  
        }
    }


    req.open("POST", "/register"); 
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(obj));

}

//post request to let the server find the items the user inputs and display them
function search(){
    let div = document.getElementById("display");
    div.innerHTML ='';
    const Artist = document.getElementById('artist').value;
    const Artwork  = document.getElementById('title').value;
    const Category = document.getElementById('category').value;



    const obj = {
        artist: Artist,
        title: Artwork,
        category: Category
        

    };

    
    req = new XMLHttpRequest();

    req.onreadystatechange = function() {
        if(this.readyState==4 && this.status==201){
            console.log("search was successful");
            const obj = JSON.parse(this.responseText)
            createlink(obj); 
          
        
           
        }
    }
    req.open("POST", "/search"); 
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(obj));



}

//used in the search function to create the link and add it to the div
function createlink(obj){
    let div = document.getElementById("display");
    for(let i in obj){
        let breaker = document.createElement('br');
        div.appendChild(breaker);
        div.appendChild(breaker);
        let a = document.createElement('a');

        let image = document.createElement('img');
        image.src = `${obj[i].poster}`
        image.alt = `${obj[i].title}`


        a.appendChild(image);

        a.href = `http://localhost:3000/artwork/${obj[i]._id}`

        div.appendChild(a); 

        
        div.appendChild(breaker);


    }

}

//to add the user inputted artpiece to database
function addArtwork(){
    const title = document.getElementById('artworkTitle').value;
    const artist = document.getElementById('artist').value;
    const year  = document.getElementById('year').value;
    const category = document.getElementById('category').value;
    const medium = document.getElementById('medium').value;
    const description = document.getElementById('description').value;
    const poster = document.getElementById('poster').value;


    const obj = {
        title: title,
        artist: artist,
        year: year,
        category: category,
        medium: medium,
        description: description,
        poster: poster

    }; 

    req = new XMLHttpRequest();

    req.onreadystatechange = function() {
        if(this.readyState==4 && this.status==201){
            console.log("adding artwork was successful");
            const username = JSON.parse(this.responseText)
            console.log(username.username);
            window.location.href = `http://localhost:3000/artist/${username.username}`
          
            
        } if(this.readyState==4 && this.status==401){
            alert("artist name must match username and artwork title must be unique"); 
            window.location.href = window.location.href;
        }
    }

    req.open("POST", "/addartwork"); 
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(obj));


}

//to add the user inputted workshop to database
function addWorkshop(){
    const title = document.getElementById('workshopTitle').value;

    req = new XMLHttpRequest();

    req.onreadystatechange = function() {
        if(this.readyState==4 && this.status==201){
            console.log("adding workshop was successful");
            const username = JSON.parse(this.responseText)
            console.log(username.username);
            window.location.href = `http://localhost:3000/artist/${username.username}`

           
            
        } 
    }

    
    req.open("POST", "/addworkshop"); 
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify({title: title}));

 


}

//where account is changed from patron to artist
function Change(){

    if(boolean === true){
        boolean = false; 
    }else{
        boolean = true; 
    }

    req = new XMLHttpRequest();
 

    req.onreadystatechange = function() {
        if(this.readyState==4 && this.status==201){
            console.log("Change was successful");
            window.location.href = window.location.href
            
           
        }
    }

    req.open("POST", "/change"); 
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify({artist: boolean}));

}

//post request to server to add the enrolled user to the artist enrolled field in the database
function enroll(event){
    console.log("enrolled");
    let title = event.target.id;
    console.log("this is the title"); 
    console.log(title);


    obj = {
        artist: artUser,
        title: title    

    }; 
 
    req = new XMLHttpRequest();
 

    req.onreadystatechange = function() {
        if(this.readyState==4 && this.status==201){
            console.log("Change was successful");
            alert("you are enrolled successfully!")
            window.location.href = window.location.href;
            
           
        }
    }

    req.open("POST", "/enroll"); 
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(obj));

}

//post request to server, in order to let server add the followed artist to the database for...
//the user following field
function follow(change){
    let button = "follow"; 
    if(change.innerHTML === "follow/unfollow" ||change.innerHTML === "follow" ){
        change.innerHTML = "unfollow"; 
         
    }else{
        change.innerHTML = "follow"; 
        button = "unfollow"
        
    }

    let obj = {
        artist: artUser,
        button: button 
    };

    req = new XMLHttpRequest();
 

    req.onreadystatechange = function() {
        if(this.readyState==4 && this.status==201){
            console.log("Change was successful");
            
            
           
        }
    }

    req.open("POST", "/follow"); 
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(obj));


}

//post request to server to add the like to database
function addLike(){
    let x  = 1; 
    console.log("the art id...");
    console.log(artID); 
    console.log("the artist...");
    console.log(artUser); 

    obj= {
        like: x, 
        artist: artUser,
        artworkID: artID,
        poster: img
    }; 


    req = new XMLHttpRequest();
 

    req.onreadystatechange = function() {
        if(this.readyState==4 && this.status==201){
            console.log("Change was successful");
            window.location.href = window.location.href
            
            
           
        }
    }

    req.open("POST", "/like"); 
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(obj));


}

//post request to server to add the review to database
function addReview(){
    const review = document.getElementById("review").value;
    obj = {
        review: review,
        artist: artUser,
        artworkID: artID,
        poster: img
    }; 


    req = new XMLHttpRequest();

    req.onreadystatechange = function() {
        if(this.readyState==4 && this.status==201){
            console.log("Change was successful");
            window.location.href = window.location.href
            
            
           
        }
    }

    req.open("POST", "/review"); 
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(obj));


}

//get request to server in order to log out
function logout(){
    console.log("logout");

    req = new XMLHttpRequest();

    req.onreadystatechange = function() {
        if(this.readyState==4 && this.status==200){
            alert("logout was successful");
            window.location.href = `http://localhost:3000/logout`
            
            
           
        }
    }

    req.open("GET", "/logout"); 
    req.send();
}
