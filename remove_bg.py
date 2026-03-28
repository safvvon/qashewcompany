from rembg import remove
from PIL import Image

input_path = 'public/user_cashew.png'
output_path = 'public/user_cashew_nobg.png'

with open(input_path, 'rb') as i:
    with open(output_path, 'wb') as o:
        input_data = i.read()
        output_data = remove(input_data)
        o.write(output_data)

print(f"Background removed and saved to {output_path}")
