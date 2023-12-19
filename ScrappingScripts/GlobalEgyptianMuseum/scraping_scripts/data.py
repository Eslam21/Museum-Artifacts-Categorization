import requests
import bs4
import os
import requests.exceptions
import json
import threading

# TODO Loop over different ids + download their images
# currently you can scrap single item but with out its image
# and I dont handle missing part of the page. some pages are
# missing their discreption , title or both :(
# Good luck Youssef patrikof ;)


def download_image(base_url, item_id):
    print("current: ", item_id)
    try:
        if (os.path.exists(f"./photo/{item_id}") and os.path.exists(f"./data/{item_id}.json")):
            print("exists: ", item_id)
            return
        # Construct the URL for the specific item ID
        url = f"{base_url}/detail.aspx?id={item_id}"

        # Fetch the webpage
        website = requests.get(url)

        if website.status_code != 200:
            print(f"Failed to retrieve the webpage for item ID {item_id}")
            return

        attributes = {}

        beautifulSoup = bs4.BeautifulSoup(website.content, "html.parser")

        name = beautifulSoup.find('h1')
        description = beautifulSoup.find(id="description")
        datatable = beautifulSoup.find(id="datatable")

        if not name or name == None or not description or description == None or datatable == None:
            return

        name = name.text
        description = description.text

        datatable = datatable.findAll('tr')

        for child in datatable:
            temp = child.findAll("td")
            if len(temp) != 0:
                attributes[temp[0].text.strip()] = temp[1].text.strip()
        attributes["Name"] = name
        attributes["Description"] = description

        # Find the image table and download the image
        imgtable = beautifulSoup.find(id="imgtable")

        if imgtable:
            images = imgtable.findAll("img")
            count = 0
            for img_url in images:
                link = img_url["src"]

                if link.count("/_") != 0:
                    link = link.split("/_")
                    link = link[0]+'/'+link[1].split("/")[1]
                link = large_image_url + link

                # Retry logic for handling ReadTimeoutError
                retry_count = 3
                for attempt in range(1, retry_count + 1):
                    try:
                        img_data = requests.get(link, timeout=10).content
                        break  # Break out of the loop if successful
                    except requests.exceptions.ReadTimeout:
                        print(
                            f"Timeout error for item ID {item_id}. Retrying... (Attempt {attempt}/{retry_count})")

                # Create a folder if it doesn't exist

                imageFolder = os.path.join(
                    os.getcwd(), image_folder_name, str(item_id))

                os.makedirs(imageFolder, exist_ok=True)

                img_filename = f"{item_id}_{count}.jpg"
                data_filename = f"{item_id}.json"

                img_path = os.path.join(imageFolder, img_filename)
                data_path = os.path.join(dataFolder, data_filename)

                with open(img_path, "wb") as img_file:
                    img_file.write(img_data)
                with open(data_path, "w") as data_file:
                    data_file.write(json.dumps(attributes))

                count += 1
        else:
            print(f"No image found for item ID {item_id}.")
    except ValueError:
        print(f"file:{item_id} - error: {ValueError}")


# Specify the base URL
base_url = "https://www.globalegyptianmuseum.org"
large_image_url = "https://www.globalegyptianmuseum.org/"

image_folder_name = "photo"
os.makedirs(image_folder_name, exist_ok=True)

data_folder_name = "data"
dataFolder = os.path.join(
    os.getcwd(), data_folder_name)
os.makedirs(dataFolder, exist_ok=True)

# bs does not catch 908 name (h1)

start_id = 1
end_id = 16186  # Change this to the desired end ID

# Loop over different IDs
step = 5
for item_id in range(start_id, end_id + 1, step):
    threads = []
    for i in range(step):
        t = threading.Thread(target=download_image, args=[base_url, item_id+i])
        t.start()
        threads.append(t)

    for i in threads:
        t.join()
