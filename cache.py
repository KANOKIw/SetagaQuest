import json, random, sys, os, time

with open("./config/client-data.json", encoding="utf-8") as f:
    data = json.load(f)

_w = 0
while True:
    try:
        with open(f"./client-data-cache/client-data-{_w}.json"):
            pass
        _w += 1
    except FileNotFoundError:
        with open(f"./.cache/client-data-{_w}.json", "w") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        os.remove("./config/client-data.json")
        print("Done")
        break
