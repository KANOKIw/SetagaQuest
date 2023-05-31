import json, random, sys, os

with open("./config/client-data.json", encoding="utf-8") as f:
    data = json.load(f)

tried = 0
while True:
    try:
        with open(f"./.cache/client-data-{tried}.json"):
            pass
        tried += 1
    except FileNotFoundError:
        with open(f"./.cache/client-data-{tried}.json", "w") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        os.remove("./config/client-data.json")
        print("Done")
        break