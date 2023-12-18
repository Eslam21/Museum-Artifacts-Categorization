import os
import shutil

folder_name = "./photo"

for image_folder in os.listdir(folder_name):
    image_folder_path = f"{folder_name}/{image_folder}"
    if os.path.isdir(image_folder_path):
        images = os.listdir(image_folder_path)
        if(len(images) != 0):
            shutil.move(
                f"{image_folder_path}/{images[0]}", f"{folder_name}/{images[0]}")
            os.rename(f"{folder_name}/{images[0]}",f"{folder_name}/{image_folder}.jpg")
        else:
            os.remove(f"./data/{image_folder}.json")
        shutil.rmtree(image_folder_path)
