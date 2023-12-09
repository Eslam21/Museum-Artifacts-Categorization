import requests
import bs4
# TODO Loop over different ids + download their images
# currently you can scrap single item but with out its image
# and I dont handle missing part of the page. some pages are
# missing their discreption , title or both :(
# Good luck Youssef patrikof ;)
website = requests.get(
    "https://www.globalegyptianmuseum.org/detail.aspx?id=1")

attributes = {}

beautifulSoup = bs4.BeautifulSoup(website, "html.parser")
name = beautifulSoup.find('h1').text
description = beautifulSoup.find(id="description").text
datatable = beautifulSoup.find(id="datatable").findAll('tr')
for child in datatable:
    temp = child.findAll("td")
    if len(temp) != 0:
        attributes[temp[0].text.strip()] = temp[1].text.strip()

print(name)
print(description)
print(attributes)
