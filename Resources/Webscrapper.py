# Will gather name, images and price.

import requests


Name = "Unknown"
Images = []
Price = 0.0

PageString = ""


class Producers ():
    REV = "https://www.revrobotics.com"


class Scrapper():
    def Rev():
        global PageString, Price,Name,Images
        Price = float(PageString.split('"value":')[1].split(",")[0])
        Name = "Unknown",
        Images = []



def GetPage(Url : str):
    global PageString
    try:    
        PageString = requests.get(Url).text
        if Url.startswith(Producers.REV):
            Scrapper.Rev()
        else:
            print("Unsupported producer")
            return
    except Exception as e:
        print(e)
        return



while True:
    GetPage(input("Enter url: "))






