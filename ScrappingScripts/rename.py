import os
import threading
museums = ["BritishMuseum", "GlobalEgyptianMuseum",
           "MetMuseum", "RosicruicanMuseum"]
threads = []


def rename(museum):
    script_directory = os.path.dirname(os.path.abspath(__file__))
    museum_dir = f"{script_directory}/{museum}/photo"
    for photo in os.listdir(museum_dir):
        if photo[:3] != museum[:3].lower():
            temp = f"{museum[:3].lower()}_{photo}"
            os.rename(f"{museum_dir}/{photo}", f"{museum_dir}/{temp}")


for museum in museums:
    t = threading.Thread(target=rename, args=[museum])
    t.start()
    threads.append(t)

for thread in threads:
    thread.join()

