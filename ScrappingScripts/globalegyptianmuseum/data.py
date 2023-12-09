import requests
import bs4
import os
import requests.exceptions
# TODO Loop over different ids + download their images
# currently you can scrap single item but with out its image
# and I dont handle missing part of the page. some pages are
# missing their discreption , title or both :(
# Good luck Youssef patrikof ;)
def download_image(base_url, item_id):
    # Construct the URL for the specific item ID
    url = f"{base_url}/detail.aspx?id={item_id}"
    
    # Fetch the webpage
    website = requests.get(url)

    if website.status_code != 200:
        print(f"Failed to retrieve the webpage for item ID {item_id}")
        return

    attributes = {}

    beautifulSoup = bs4.BeautifulSoup(website.content, "html.parser")
    name = beautifulSoup.find('h1').text
    description = beautifulSoup.find(id="description").text
    datatable = beautifulSoup.find(id="datatable").findAll('tr')
    for child in datatable:
        temp = child.findAll("td")
        if len(temp) != 0:
            attributes[temp[0].text.strip()] = temp[1].text.strip()


    print(f"Name: {name}")
    print(f"Description: {description}")
    print("Attributes:")
    for key, value in attributes.items():
        print(f"  {key}: {value}")

    # Print the link to the page
    print(f"Link to the page: {url}")

    # Find the image table and download the image
    imgtable = beautifulSoup.find(id="imgtable")
    if imgtable:
        img_url_relative = imgtable.find("img")["src"]

        # Check if the image URL is absolute or relative
        if not img_url_relative.startswith("http"):
            img_url_relative = f"{base_url}/{img_url_relative}"

        # Retry logic for handling ReadTimeoutError
        retry_count = 3
        for attempt in range(1, retry_count + 1):
            try:
                img_data = requests.get(img_url_relative, timeout=10).content
                break  # Break out of the loop if successful
            except requests.exceptions.ReadTimeout:
                print(f"Timeout error for item ID {item_id}. Retrying... (Attempt {attempt}/{retry_count})")

        # Remove invalid characters from the filename
        invalid_chars = r'<>:"/\|?*'
        for char in invalid_chars:
            name = name.replace(char, '_')

        # Create a folder if it doesn't exist
        folder_name = "machine_images"
        os.makedirs(folder_name, exist_ok=True)
        img_filename = f"{item_id}_{name}_image.jpg"
        img_path = os.path.join(os.getcwd(), folder_name, img_filename)

        with open(img_path, "wb") as img_file:
            img_file.write(img_data)

        print(f"Image downloaded and saved as '{img_filename}' in the '{folder_name}' folder.")
    else:
        print(f"No image found for item ID {item_id}.")

# Specify the base URL
base_url = "https://www.globalegyptianmuseum.org"

start_id = 1
end_id = 140  # Change this to the desired end ID

# Loop over different IDs
for item_id in range(start_id, end_id + 1):
    download_image(base_url, item_id)
