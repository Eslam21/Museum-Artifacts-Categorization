import os
import re
import json
import threading
from bs4 import BeautifulSoup


def strip(string: str):
    return re.sub(r'\s+', ' ', string)


files_list = set(map(lambda x: x.replace(".html", ""), os.listdir("./html")))
files_list_done = list(
    map(lambda x: x.replace(".json", ""), os.listdir("./data")))


def transform(files_list):
    for file_name in files_list:
        try:
            with open(f"./html/{file_name}.html", encoding="UTF-8") as file:
                attributes = {}
                bs = BeautifulSoup(file, "html.parser")
                artifact_data = bs.find(
                    "section", {"class": "object-detail__data"})
                attributes["artifact_name"] = strip(artifact_data.find(
                    "h2").text)
                artifact_description = artifact_data.findAll(
                    "div", {"class": "object-detail__data-item"})
                for item in artifact_description:
                    description_title = strip(item.find("dt").text)
                    description_data = list(
                        filter(lambda x: x != '\n', list(item)))
                    description_data.pop(0)
                    description_data = list(
                        map(lambda x: strip(x.text), description_data))
                    attributes[description_title] = description_data

                attributes = json.dumps(attributes)
                with open(f"./data/{file_name}.json", 'w', encoding="UTF-8") as output:
                    output.write(attributes)
        except ValueError:
            print(ValueError)
            print("file: "+file_name)

transform(["H_WB-53"])
# threads = []
# n = len(files_list)//10+1
# files_list = list(files_list.difference(files_list_done))
# for i in range(0, len(files_list), n):
#     temp = files_list[i:i+n]
#     t = threading.Thread(target=transform, args=[temp])
#     t.start()

# for t in threads:
#     t.join()
# print(files_list)