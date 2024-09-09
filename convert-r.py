import os
import shutil
from PIL import Image

def create_archive_folder(path):
    archive_path = os.path.join(path, 'archive')
    if not os.path.exists(archive_path):
        os.makedirs(archive_path)
    return archive_path

def is_image_file(filename):
    image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff']
    return any(filename.lower().endswith(ext) for ext in image_extensions)

def resize_image(img, max_size):
    width, height = img.size
    if width > max_size or height > max_size:
        ratio = min(max_size / width, max_size / height)
        new_size = (int(width * ratio), int(height * ratio))
        return img.resize(new_size, Image.LANCZOS)
    return img

def process_directory(directory_path, max_size=1200, quality=85):
    archive_path = create_archive_folder(directory_path)
    
    for filename in os.listdir(directory_path):
        file_path = os.path.join(directory_path, filename)
        
        if os.path.isdir(file_path) and filename != 'archive':
            # Recursively process subdirectories
            process_directory(file_path, max_size, quality)
        elif is_image_file(filename):
            archive_file_path = os.path.join(archive_path, filename)
            
            # Archive the original file
            shutil.copy2(file_path, archive_file_path)
            
            # Convert to WebP and resize
            try:
                with Image.open(file_path) as img:
                    # Resize the image
                    img_resized = resize_image(img, max_size)
                    
                    webp_filename = os.path.splitext(filename)[0] + '.webp'
                    webp_path = os.path.join(directory_path, webp_filename)
                    
                    # Save as WebP with specified quality
                    img_resized.save(webp_path, 'WEBP', quality=quality)
                
                # Remove the original file after successful conversion
                os.remove(file_path)
                print(f"Converted and resized {filename} to WebP and archived original in {directory_path}")
            except Exception as e:
                print(f"Error processing {filename} in {directory_path}: {str(e)}")

if __name__ == "__main__":
    cabinetry_path = "/Users/kean.edwards/Desktop/Projects/michael/images/cabinetry/woodacre-kitchen"
    process_directory(cabinetry_path)