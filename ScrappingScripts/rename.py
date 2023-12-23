import os
import threading
museums = ["BritishMuseum", "GlobalEgyptianMuseum",
           "MetMuseum", "RosicruicanMuseum"]
threads = []


def rename(museum):
    museum_dir = f"./{museum}/photo"

    for photo in os.listdir(museum_dir):
        if photo[:3] != museum[:3]:
            temp = f"{museum[:3]}_{photo}"
            os.rename(f"{museum_dir}/{photo}", f"{museum_dir}/{temp}")


for museum in museums:
    t = threading.Thread(target=rename, args=[museum])
    t.start()
    threads.append(t)

for thread in threads:
    thread.join()
