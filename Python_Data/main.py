import requests
import json


# URL = "https://api.gsa.gov/assets/gsaauctions/v2//auctions"

URL = "https://dummyjson.com/products"

def fetch_auctions():
    response = requests.get(URL)
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

def main():
    try:
        print ("Fetching auctions data...")
        auctions_data = fetch_auctions()
        with open('auctions.json', 'w') as json_file:
            json.dump(auctions_data, json_file, indent=4)
        print("Auctions data has been written to auctions.json")
    except Exception as e:
        print(f"An error occurred: {e}")
main()
print ("Hello World")