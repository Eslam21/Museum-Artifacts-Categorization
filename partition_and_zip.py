import os
import re
from zipfile import ZipFile

def extract_number_from_filename(filename):
    match = re.search(r'\d+', filename)
    return int(match.group()) if match else None

def split_images_into_zips(folder_path, images_per_zip=1000):
    # Ensure the folder path ends with a slash
    folder_path = os.path.join(folder_path, '')
    
    # Create a list of image files in the folder
    image_files = [f for f in os.listdir(folder_path) if f.endswith('.jpg')]

    # Sort the image files using the numeric part of the file name
    image_files.sort(key=lambda x: extract_number_from_filename(x) or float('inf'))

    # Create zip files
    for i in range(0, len(image_files), images_per_zip):
        zip_filename = f'images_{i // images_per_zip + 1}.zip'
        zip_path = os.path.join(os.getcwd(), zip_filename)

        with ZipFile(zip_path, 'w') as zip_file:
            for j in range(i, min(i + images_per_zip, len(image_files))):
                image_path = os.path.join(folder_path, image_files[j])
                zip_file.write(image_path, os.path.basename(image_path))

    print(f"Done! {len(image_files)} images split into zip files.")

# Specify the path to the folder containing the images
folder_path = 'Museum_artifacts/'

# Specify the number of images per zip file
images_per_zip = 1000

# Call the function to split images into zip files
split_images_into_zips(folder_path, images_per_zip)
