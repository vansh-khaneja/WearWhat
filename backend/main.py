from image_tagging import tag_image

from mongodb_uploader import upload_item, get_item, delete_item, get_items, delete_items, update_item
from auth import sign_up, login, delete_user

from cloudinary_uploader import upload_image, delete_image

from uuid import uuid4

# Pass image and get tagged dict
# tagged_dict = tag_image("test.jpg")

# url, public_id = upload_image("test.jpg")

wardrobe_id = "test"

# document = {"wardrobe_id": wardrobe_id, "item_id": str(uuid4()), "image_url": url, "tags": tagged_dict}

response = get_items(wardrobe_id)

print(response)

# items = get_items(wardrobe_id)
# for item in items:
#     print(item["item_id"])

# response = delete_items(wardrobe_id)
# print(response)

# update_item("71b0a92a-54a1-40fc-bc1b-8a02c8fae800", {"tags": tagged_dict})

# response = delete_item("71b0a92a-54a1-40fc-bc1b-8a02c8fae800")
# print(response)

# items = get_item("71b0a92a-54a1-40fc-bc1b-8a02c8fae800")
# print(items)

# Sign up example
# auth = {"email": "test@gmmail.com", "password": "test123", "username": "testuser"}
# response = sign_up(auth)
# print(f"Sign up successful. User ID: {response}")

# Login example
# login_auth = {"email": "test@gmmail.com", "password": "test123"}
# login_result = login(login_auth)
# print(f"Login result: {login_result}")

