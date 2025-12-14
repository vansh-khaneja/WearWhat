from image_tagging import tag_image

from mongodb_uploader import upload_item, get_item, delete_item, get_items, delete_items, update_item

from cloudinary_uploader import upload_image, delete_image

from uuid import uuid4
# Pass image and get tagged dict
tagged_dict = tag_image("test.jpg")

# url,public_id = upload_image("test.jpg")

wardrobe_id = "abc123"

# document = {"wardrobe_id": wardrobe_id, "item_id": str(uuid4()), "image_url": url, "tags": tagged_dict}


# response = upload_item(document)

# print(response)

items = get_item("71b0a92a-54a1-40fc-bc1b-8a02c8fae800")
print(items)
# for item in items:
#     print(item["item_id"])



# response = delete_items(wardrobe_id)
# print(response)


# update_item("71b0a92a-54a1-40fc-bc1b-8a02c8fae800", {"tags": tagged_dict})

response = delete_item("71b0a92a-54a1-40fc-bc1b-8a02c8fae800")
print(response)

items = get_item("71b0a92a-54a1-40fc-bc1b-8a02c8fae800")
print(items)