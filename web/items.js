//setup page
const app = document.getElementById('items')
const container = document.createElement('div')
container.setAttribute('class', 'container')
app.appendChild(container)

// define errors
// items empty
const itemserror = document.getElementById('itemserror');
itemserror.textContent = "Current Inventory";

// form validation message
const formerror = document.getElementById('formerror');
formerror.textContent = "";

//check if alert is in url, if so, display alert
urlParam = new URLSearchParams(window.location.search);
if (urlParam.has('alert'))
    alertbootstrap(urlParam.get('type'), urlParam.get('content'));

//fetch data from api
function fetchItems(){
    fetch('http://127.0.0.1:8000/items')
    .then(data => data.json())
    .then(json => displayItems(json))
    .catch(error => {
        // error message for API
        errorMessage = document.createElement('div');
        errorMessage.setAttribute('class', 'error');
        errorMessage.textContent = "Error: " + error;
        app.appendChild(errorMessage);
    });
}

fetchItems();

//dynamically create list of items according to data fetched from api
function displayItems(data) {
    
    if (data.length === 0) {    //if no items, display error
        itemserror.setAttribute('class', 'error');
        itemserror.textContent = "No Items Found";
        return;
    }

    // dynamically create list of items and their markup
    data.forEach((item) => {

        const row = document.createElement('div'); 
        row.setAttribute('class', 'row');

        const id = document.createElement('div');
        id.setAttribute('class', 'col-3');
        id.textContent = "ID: " + item._id;
        
        const name = document.createElement('div');
        name.setAttribute('class', 'col-2');
        name.textContent = "Name: " + item.name;

        const desc = document.createElement('div');
        desc.setAttribute('class', 'col-3');
        desc.textContent =  "Desc: " + item.desc;

        const price = document.createElement('div');
        price.setAttribute('class', 'col-1');
        price.textContent =  "Price: " + item.price;

        const qty = document.createElement('div');
        qty.setAttribute('class', 'col-1');
        qty.textContent =  "Qty: " + item.quantity;

        buttondiv = document.createElement('div');
        buttondiv.setAttribute('id', 'buttondiv');
        buttondiv.setAttribute('class', 'col-2');
        buttondiv.setAttribute('align', 'right');

        // edit button
        const editbtn = document.createElement('button');
        editbtn.setAttribute('id', 'editBtn');
        editbtn.setAttribute('class', 'btn btn-primary');
        editbtn.textContent = "Edit";

        // edit handler, puts data into modal
        editbtn.addEventListener('click', () => {
            $('#Modal').modal('toggle');
            $('#idInput').val(item._id);
            idInput.setAttribute('readonly', true);
            $('#nameInput').val(item.name);
            $('#descInput').val(item.desc);
            $('#priceInput').val(item.price);
            $('#quantityInput').val(item.quantity); 
        });

        // del button
        const delbtn = document.createElement('button');
        delbtn.setAttribute('id', 'deleteBtn');
        delbtn.setAttribute('class', 'btn btn-danger');
        delbtn.textContent = "Delete";

        // del handler, deletes item from api
        delbtn.addEventListener('click', () => {
            fetch('http://127.0.0.1:8000/items/' + item._id, {
                method: 'DELETE'
            })
            .then(function(response) {
                alertbootstrap("success", `Item ${item._id}: Deleted Successfully! Status: ${response.status}`, refresh=true);
                console.log(response);
            })
            .catch(error => {
                console.log(error);
                alertbootstrap("danger", `Item ${item._id}: Failed to Delete! Error: ${error}`);
            });
        });

        // append to container
        row.appendChild(id);
        row.appendChild(name);
        row.appendChild(desc);
        row.appendChild(price);
        row.appendChild(qty);
        row.appendChild(buttondiv);
        buttondiv.appendChild(editbtn);
        buttondiv.appendChild(delbtn);

        container.appendChild(row);

        br = document.createElement('br');
        container.appendChild(br);
    });

}

//save modal button and handler
saveEditModal = document.getElementById('saveModal');
saveEditModal.addEventListener('click', () => {

    const editForm = document.getElementById('form');
    
    if (editForm)
    {  //grab fields
        id = $('#idInput').val();
        name = $('#nameInput').val();
        desc = $('#descInput').val();
        price = $('#priceInput').val();
        qty = $('#quantityInput').val();

        //split into 2 piece "dict"
        listKeys = ["Iid", "Name", "Desc", "Price", "Quantity"];
        listValues = [id, name, desc, price, qty];
        listEmpty = [];
        formerror.textContent = "Please Fill Out: "

        // check for empty values, add key to empty list
        for (i in listValues)
            if (listValues[i] == "")
                listEmpty.push(listKeys[i]);

        // if list of empty values, add key of value to error message
        if (listEmpty.length > 0)
            for (i in listEmpty)
                formerror.textContent += listEmpty[i] + ", ";
            
        else{   //else, post data to api
            formerror.textContent = "";
            handleEdit(id, name, desc, price, qty);
        }
    }
    return
});

//close modal button click, also empties form errors
closeModal = document.getElementById('closeModal');
closeModal.addEventListener('click', () => {
    $('#Modal').modal('hide');
    formerror.textContent = "";
});

//handles edit for saving modal
function handleEdit(id, name, desc, price, qty)
{
    // put request to api   
    fetch('http://127.0.0.1:8000/items/'+ id, {
        method: 'PUT',
        body: JSON.stringify({
            name: name,
            desc: desc,
            price: price,
            quantity: qty
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })  //redirect
    .then(function(response) {
        $('#Modal').modal('hide');
        if (response.status == 404 || response.status == 400){
            alertbootstrap("danger", `Item ${id}: Failed to Edit! Status: ${response.status}: ${response.statusText}`);
            return;
        }
        alertbootstrap("success", `Item ${id}: Edited Successfully! Status: ${response.status}: ${response.statusText}`, refresh=true);
    }) //catch error, display message
    .catch(error => {
        console.log(error);
        alertbootstrap("danger", `Item ${id}: Failed to Edit! Error: ${error}}`);
    });
}

// bootstrap alert, refreshes page if refresh=true
function alertbootstrap(type, content, refresh=false)
{
    if (refresh)
    {
        container.innerHTML = "";
        fetchItems();
    }

    // create alert
    const app = document.getElementById('root');
    const alert = document.createElement('div');
    alert.setAttribute('class', 'alert alert-' + type + ' alert-dismissible fade show');
    alert.setAttribute('role', 'alert');
    alert.textContent = content;
    app.prepend(alert);

    // close alert after 2.5 seconds
    $(".alert").delay(2500).slideUp(1000, function() {
        $(this).alert('close');
    });
}


