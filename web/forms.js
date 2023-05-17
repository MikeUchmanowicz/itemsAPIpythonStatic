// create form submit button handler
function handleCreate(event, form)
{
    //prevent refresh and url change
    event.preventDefault();
    
    let data = new FormData(form);
    let formData = Object.fromEntries(data);
    
    createItem(formData)
}

// creates item
async function createItem(formData)
{
    // POST request to api
    await fetch('http://18.214.23.15:8080/items/', {
        method: 'POST',
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
        // alert according to response
        if (!response.status == 200){
            alertbootstrap("danger", `Item: Failed to Create! Status: ${response.status}: ${response.statusText}`);
            return;
        }
        alertbootstrap("success", `Item: Created Successfully! Status: ${response.status}, ${response.statusText}`, redirect=true);
    })
    .catch(error => { // catch error, alert message
        console.log(error);
        alertbootstrap("danger", `Item: Failed to Create! Backend Error: ${error}`);
    });
}

// edit form submit Button handler
function handleEdit(event, form){
    //prevent refresh and url change
    event.preventDefault();
    
    let data = new FormData(form);
    let formData = Object.fromEntries(data);

    editItem(formData);
};

// edit item by id with form data
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

// bootstrap alert, redirects page if redirect=true
function alertbootstrap(type, content, redirect=false)
{
    // define alert after redirect tthrough url parameters
    if (redirect)
        window.location.href=`items.html?alert=true&type=${type}&content=${content}`;
    else
    {
        let app = document.getElementById('root');
        const alert = document.createElement('div');
        alert.setAttribute('class', 'alert alert-' + type + ' alert-dismissible fade show');
        alert.setAttribute('role', 'alert');
        alert.setAttribute('align', 'center');
        let alertcontent = document.createElement('div');
        alertcontent.textContent = content;

        alert.appendChild(alertcontent);
        app.prepend(alert);

        // close alert after 2.5 seconds
        $(".alert").delay(1500).slideUp(1000, function() {
            $(this).alert('close');    
        });
    }
    
}


