from bson import ObjectId
from fastapi import APIRouter, Body, HTTPException, Request
from fastapi.responses import Response, JSONResponse

import pprint

from typing import ItemsView, List

# define router for items
router = APIRouter(
    prefix="/items",
    tags=["items"],
)

#gets all items, returns a list of items
@router.get("/", response_description="GETS all items")
async def read_items(request: Request):
    result = request.app.database["items"].find()
    list_result = list(result)

    # convert ObjectId to string for all results in list of result dict
    list_result = [ {**result, "_id": str(result["_id"])} for result in list_result ]
    
    return list_result

#gets an item by ID, returns an item
@router.get("/{id}", response_description="GETS items with id parameter")
async def read_item_by_id(request: Request, id: str):
    
    if (not ObjectId.is_valid(id)):
        raise HTTPException(status_code=400, detail="Invalid ID")
    
    result = request.app.database["items"].find_one({"_id": ObjectId(id)})
    
    if result:
        result["_id"] = str(result["_id"])
        return result
    
    raise HTTPException(status_code=404, detail=f"Item with id {id} not found")
    
#creates an item, returns the created item
@router.post("/", response_description="Add new Item with request body")
async def create_item(request: Request, body=Body(...)):
    inserted_item = request.app.database["items"].insert_one(body)
    new_item = request.app.database["items"].find_one({"_id": inserted_item.inserted_id})
    
    if new_item:
        new_item["_id"] = str(new_item["_id"])
        return new_item
    
    raise HTTPException(status_code=500, detail="Creation Failed")

#updates an item, returns the updated item
@router.put("/{id}", response_description="Edit Item with ID parameter")
async def update_item(request: Request, id: str, body = Body(...)):
    
    if (not ObjectId.is_valid(id)):
        raise HTTPException(status_code=400, detail="Invalid ID")
    
    idExist = request.app.database["items"].find_one({"_id": ObjectId(id)})
    if (not idExist):
        raise HTTPException(status_code=404, detail=f"Item with id {id} not found")
    
    update = request.app.database["items"].update_one({"_id": ObjectId(id)}, {"$set": body})
    
    if (not idExist == body and update.modified_count == 1):
        updated_item = request.app.database["items"].find_one({"_id": ObjectId(id)})
        updated_item["_id"] = str(updated_item["_id"])
        return updated_item
    
#deletes an item, returns the item deleted
@router.delete("/{item_id}", response_description="Delete Item with ID parameter")
async def delete_item(request: Request, item_id: str):
    
    delete = request.app.database["items"].delete_one({"_id": ObjectId(item_id)})
    if delete.deleted_count == 1:
        return Response(status_code=204)
    
    raise HTTPException(status_code=404, detail=f"Item with id {item_id} not found")
    