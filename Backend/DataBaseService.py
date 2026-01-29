from dotenv import load_dotenv
import supabase
import os




def InitializeEnviron():
    load_dotenv("Backend\.env") # So it can work on Virtual Environment


def InitalizeDB():
    URL : str = os.environ.get("DBURL")
    KEY : str =  os.environ.get("DBKEY")
    
    DbClient = supabase.create_client(URL,KEY)


#Classes meant for organization

class FrontEndRequests:
    pass


#For behind the scenes stuff
class InternalRequests:
    def AddProductToDB():
        pass


