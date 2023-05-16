//setup page
const container = document.getElementById('items')
container.setAttribute('class', 'container')

// define errors
const itemserror = document.getElementById('itemserror');

//check if alert is in url, if so, display alert
let urlParam = new URLSearchParams(window.location.search);
if (urlParam.has('alert'))
    alertbootstrap(urlParam.get('type'), urlParam.get('content'));

//fetch data from api
function fetchItems(){
    fetch('http://18.214.23.15:8080/items')
    .then(data => data.json())
    .then(json => displayItems(json))
    .catch(error => {
        // error message for API
        itemserror.setAttribute('class', 'error');
        itemserror.textContent = "Failed to Fetch Items: " + error;
        return;
    });
}

fetchItems()

//dynamically create list of items according to data fetched from api
function displayItems(data) {
    
    if (data.length === 0) {    //if no items, display error
        itemserror.setAttribute('class', 'error');
        itemserror.textContent = "No Items Found";
        return;
    }

    // dynamically create list of items and their markup
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

        // edit handler, puts data into modal
        editbtn.addEventListener('click', (e) => {
            e.stopPropagation();
            $('#editModal').modal('show');
            $('#idInput').val(item._id);
            //idInput.setAttribute('readonly', true);
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

        // delete handler, puts data into modal
        delbtn.addEventListener('click', (e) => {
            e.stopPropagation();
            $('#delModal').modal('show');
            $('#delId').val(item._id);
            //idInput.setAttribute('readonly', true);
        });
        
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

//save modal button and handler
function handleEdit(form){
    
    let data = new FormData(form);
    let formData = Object.fromEntries(data);

    let id = formData.id;
    let name = formData.name;
    let desc = formData.desc;
    let price = formData.price;
    let qty = formData.quantity
    
    editItem(id, name, desc, price, qty);
};

function handleDelete(form){
    
    let data = new FormData(form);
    let formData = Object.fromEntries(data);

    let delId = formData.delId;


    deleteItem(delId);
};

//close modal button click, also empties form errors
function handleModalCancel(){
    $('#editModal').modal('hide');
    $('#delModal').modal('hide');
    
};

async function deleteItem(id)
{
    await fetch('http://18.214.23.15:8080/items/' + id, {
        method: 'DELETE'
    })
    .then(function(response) {
        $('#delModal').modal('hide');
        alertbootstrap("success", `Item ${id}: Deleted Successfully! Status: ${response.status}`, refresh=true);

    })
    .catch(error => {
        console.log(error);
        alertbootstrap("danger", `Item ${id}: Failed to Delete! Error: ${error}`);
    });

}
//handles edit for saving modal
async function editItem(id, name, desc, price, qty)
{
    // put request to api   
    await fetch('http://18.214.23.15:8080/items/'+ id, {
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
        $('#editModal').modal('hide');
        if (response.status == 404 || response.status == 400){
            alertbootstrap("danger", `Item ${id}: Failed to Edit! Status: ${response.status}: ${response.statusText}`);
        }
        else
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
    // define alert after redirect tthrough url parameters
    if (refresh)
        location.href=`items.html?alert=true&type=${type}&content=${content}`;
    else{
        let app = document.getElementById('root');
        const alert = document.createElement('div');
        alert.setAttribute('class', 'fixed-top alert alert-' + type + ' alert-dismissible fade show');
        alert.setAttribute('role', 'alert');
        alert.textContent = content;
        app.prepend(alert);

        // close alert after 2.5 seconds
        $(".alert").delay(2500).slideUp(1000, function() {
            $(this).alert('close');    
        });
    }
}