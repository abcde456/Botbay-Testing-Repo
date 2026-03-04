from dotenv import load_dotenv
import supabase
import os


DbClient : supabase.Client

def InitializeEnviron():
    load_dotenv(R"Backend\.env") # So it can work on Virtual Environment

    if os.environ.get("Debug"):
        print("Environ works")


def InitalizeDB():
    global DbClient
    URL : str = os.environ.get("DBURL")
    KEY : str =  os.environ.get("DBKEY")
    
    DbClient = supabase.create_client(URL,KEY)
    
    




def GetData(Type : str,TeamID : int,UserUHID : str):
    Response = (
        DbClient.from_("Teams")
        .select("*")
        .eq("id",0)
        .execute()
    )
    print(Response)
    

