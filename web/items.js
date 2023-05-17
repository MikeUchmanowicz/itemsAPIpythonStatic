// upon document load
document.addEventListener("DOMContentLoaded", () => {
  
    // check if alert is in url, if so, display alert
    let urlParam = new URLSearchParams(window.location.search);
    if (urlParam.has('alert'))
        alertbootstrap(urlParam.get('type'), urlParam.get('content'));
    
    // fetch items and create html for them
    fetchItems()
});

// fetch data from API, THEN call displayItems
async function fetchItems(){
    //GET request to API
    await fetch('http://18.214.23.15:8080/items')
    .then(data => data.json())
    .then(json => displayItems(json))
    .catch(error => {
        // error message for API
        let itemserror = document.getElementById('itemserror');
        itemserror.setAttribute('class', 'error');
        itemserror.textContent = "Failed to Fetch Items: " + error;
        return;
    });
}

//dynamically create list of items according to API data
function displayItems(data) {
    
    if (data.length === 0) {    //if no items, display error
    let itemserror = document.getElementById('itemserror');
        itemserror.setAttribute('class', 'error');
        itemserror.textContent = "No Items Found";
        return;
    }

    data.forEach((item) => {

        let itemrow = document.createElement('div');
        itemrow.setAttribute('class', 'row itemrow');
        itemrow.addEventListener('click', () => {
            location.href=`oneItem.html?id=${item._id}`;
        });

        let id = document.createElement('div');
        id.setAttribute('class', 'col-md-auto rowcol');
        id.setAttribute('id', 'idcol');
        id.innerHTML = "<b>ID:&nbsp;</b>" + item._id;
        
        let name = document.createElement('div');
        name.setAttribute('id', 'namecol');
        name.setAttribute('class', 'col-md-auto rowcol');
        name.innerHTML = "<b>Name:&nbsp;</b>" + item.name;

        let desc = document.createElement('div');
        desc.setAttribute('id', 'desccol');
        desc.setAttribute('class', 'col-md-auto rowcol');
        desc.innerHTML =  "<b>Desc:&nbsp;</b>" + item.desc;

        let price = document.createElement('div');
        price.setAttribute('id', 'pricecol');
        price.setAttribute('class', 'col-md-auto rowcol');
        price.innerHTML =  "<b>Price:&nbsp;</b>" + item.price;

        let qty = document.createElement('div');
        qty.setAttribute('id', 'qtycol');
        qty.setAttribute('class', 'col-md-auto rowcol');
        qty.innerHTML =  "<b>Qty:&nbsp;</b>" + item.quantity;

        let buttondiv = document.createElement('div');
        buttondiv.setAttribute('id', 'buttondiv');
        buttondiv.setAttribute('class', 'col-md-auto rowcol');

        // edit button
        let editbtn = document.createElement('button');
        editbtn.setAttribute('id', 'editBtn');
        editbtn.setAttribute('class', 'btn btn-secondary');
        editbtn.textContent = "Edit";

        // editBtn handler, puts item data into modal
        editbtn.addEventListener('click', (e) => {
            e.stopPropagation();
            $('#editModal').modal('show');
            $('#idInput').val(item._id);
            $('#nameInput').val(item.name);
            $('#descInput').val(item.desc);
            $('#priceInput').val(item.price);
            $('#quantityInput').val(item.quantity); 
        });

        // del button
        let delbtn = document.createElement('button');
        delbtn.setAttribute('id', 'deleteItemBtn');
        delbtn.setAttribute('class', 'btn btn-danger');
        delbtn.textContent = "Del";

        // delBtn handler, puts data into modal
        delbtn.addEventListener('click', (e) => {
            e.stopPropagation();
            $('#delModal').modal('show');
            $('#delId').val(item._id);
        });
        
        //define base container
        let container = document.getElementById('items')
        container.setAttribute('class', 'container')
        
        // append to container
        itemrow.appendChild(id);
        itemrow.appendChild(name);
        itemrow.appendChild(desc);
        itemrow.appendChild(price);
        itemrow.appendChild(qty);
        itemrow.appendChild(buttondiv);
        
        buttondiv.appendChild(editbtn);
        buttondiv.appendChild(delbtn);

        container.appendChild(itemrow);
    });
}

//close modal button click
function handleModalCancel(){
    $('#editModal').modal('hide');
    $('#delModal').modal('hide');
    
};

// delete modal submit button handler
function handleDelete(event, form){
    //prevent refresh and url change
    event.preventDefault();
    
    let data = new FormData(form);
    let formData = Object.fromEntries(data);
    let delId = formData.delId;

    deleteItem(delId);
};

// deletes item with id
 async function deleteItem(id)
{
    // DELETE request to api
    await fetch('http://18.214.23.15:8080/items/' + id, {
        method: 'DELETE'
    })
    .then(function(response) {
        $('#delModal').modal('hide');
        
        // alert according to response
        if (!(response.status == 200 || 204))
            alertbootstrap("danger", `Item ${id}: Failed to Delete! Error: ${response.status}`);
        else    
            alertbootstrap("success", `Item ${id}: Deleted Successfully! Status: ${response.status}`, refresh=true);
    }) 
    .catch(error => { //catch error, alert message
        console.log(error);
        alertbootstrap("danger", `Item ${id}: Failed to Delete! Error: ${error}`);
    });
}

//save modal form submit button handler
function handleEdit(event, form){
    //prevent refresh and url change
    event.preventDefault();
    
    let data = new FormData(form);
    let formData = Object.fromEntries(data);

    editItem(formData);
};

// edits item with id obtained from form
async function editItem(formData)
{
    let id = formData.id
    
    // PUT request to api   
    await fetch('http://18.214.23.15:8080/items/'+ id, {
        method: 'PUT',
        body: JSON.stringify({
            name: formData.name,
            desc: formData.desc,
            price: parseInt(formData.price),
            quantity: parseInt(formData.quantity)
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(function(response) {
        $('#editModal').modal('hide');
        
        // alert according to response
        if (response.status == 404 || response.status == 400)
            alertbootstrap("danger", `Item ${id}: Failed to Edit! Status: ${response.status}: ${response.statusText}`);
        else if (response.status == 304)
            alertbootstrap("secondary", `Item ${id}: Not Modified Status: ${response.status}: ${response.statusText}`);
        else
            alertbootstrap("success", `Item ${id}: Edited Successfully! Status: ${response.status}: ${response.statusText}`, refresh=true);
        
    })
    .catch(error => { //catch error, alert message
        console.log(error);
        alertbootstrap("danger", `Item ${id}: Failed to Edit! Error: ${error}}`);
    });
}

// bootstrap alert, refreshes page if refresh=true
function alertbootstrap(type, content, refresh=false)
{
    //if refresh, first refresh, dom will call alert on load through url params.
    if (refresh)
        window.location.href=`items.html?alert=true&type=${type}&content=${content}`;
    
    //define root and append newly created alert
    let app = document.getElementById('root');
    let alert = document.createElement('div');
    let alertcontent = document.createElement('div');
    
    alert.setAttribute('class', 'alert alert-' + type + ' alert-dismissible fade show');
    alert.setAttribute('role', 'alert');
    alert.setAttribute('align', 'center');
    
    alertcontent.textContent = content;

    alert.appendChild(alertcontent);
    app.prepend(alert);

    // close alert after 2.5 seconds
    $(".alert").delay(1500).slideUp(1000, function() {
        $(this).alert('close');  
        
    });
}