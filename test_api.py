import requests

url = "http://127.0.0.1:5000/analyze"

with open("resume.pdf", "rb") as f:
    response = requests.post(url, files={"resume": f})

print(response.json())