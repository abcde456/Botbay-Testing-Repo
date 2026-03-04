# Run Flask Server




import flask
from flask_socketio import SocketIO, emit
import os
import base64
import DataBaseService


DataBaseService.InitializeEnviron() 


App = flask.Flask(__name__)
Websocket = SocketIO(App)


def ServerMessage(Status : str):
    emit("ServerMessage",{"Status":Status})




@Websocket.on("Ping")
def Ping():
    ServerMessage("Server is healthy")


@Websocket.on("GetParts")
def GetParts():
    pass


@App.route("/")
def Debug():
    return "Server is up!"


@App.route("/AddProduct", methods=["GET", "POST"])
def AddProduct(Request):

    Request = flask.request

    if Request.method == "POST":
        # Accessing JSON data sent via fetch
        Data = Request.get_json()
        
        Auth = Data.get("Auth")
        Name = Data.get("Name")
        Images = Data.get("Urls")

        if base64.b64decode(Auth) == os.environ["AuthCode"]:
            return flask.jsonify({"Status": "Success", "Message": f"Product {Name} added"}), 200
        else:
            return flask.jsonify({"Status": "Error", "Message": f"Incorrect Authentication"}), 460



        

    return flask.render_template("AddProduct.htm")


        
    

DataBaseService.InitalizeDB()

print(DataBaseService.GetData(1,1,1))

Websocket.run(App,debug=True)




