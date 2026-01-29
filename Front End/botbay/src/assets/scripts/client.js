const io = require("socket.io-client");





const backendUrl = "http://127.0.0.1:5000/"; // Set to true backend after deployment

const socket = io(backendUrl);



function fetchServer(requestType,data){ // Two way websocket communication
    return new Promise((resolve,reject) => {
         socket.emit(requestType,data, (response) => {
            
            if (!response){
                reject("Server fetch timeout or no connection!");
            } else if (response.error){
                reject(response.error);
            } else {
                resolve(request);
            }


         });




    });
}



function login(username,password){ //Attempt to login to an account, if account login success the user token will be returned.

}


socket.on("Connect",function(){ 
    console.log("Connected to server.");
});








//Object classes



class Team {

    constructor(teamName,members,owner){ //member and owner are "ids"
        this.teamName = teamName;
        this.members = members;
        this.owner = owner;
        this.parts = [];
        this.batteries = [];
        this.packinglist = [];
        this.upcoming = [];
    }

    static async fetch(){
        try {
            const response = await fetchServer("GetTeam",{TeamID : 0});

            const teamInfo = response.TeamInfo;

            team = new Team(teamName = teamInfo.Name,members = teamInfo.Members,owner = teamInfo.Owner);

            //do more stuff to team later.


            return team;

        } catch(error){
            console.error(error);
            return null;
        }

    }


}



