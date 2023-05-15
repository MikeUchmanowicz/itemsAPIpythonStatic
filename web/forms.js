// handle create
function handleCreate(form)
{
    let data = new FormData(form);
    let formData = Object.fromEntries(data);
    
    fetch('http://18.214.23.15:8080/items/', {
        method: 'POST',
        body: JSON.stringify({
            name: formData.name,
            desc: formData.desc,
            price: formData.price,
            quantity: formData.quantity
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(function(response) {
        if (!response.status == 200){
            alertbootstrap("danger", `Item: Failed to Create! Status: ${response.status}: ${response.statusText}`);
            return;
        }
        alertbootstrap("success", `Item: Created! Status: ${response.status}, ${response.statusText}`, redirect=true);
    })
    .catch(error => {
        console.log(error);
        alertbootstrap("danger", `Item: Failed to Create! Backend Error: ${error}`);
    });
}

// handle edit
function handleEdit(form)
{
    let data = new FormData(form);
    let formData = Object.fromEntries(data);

    fetch('http://18.214.23.15:8080/items/'+ formData.id, {
        method: 'PUT',
        body: JSON.stringify({
            name: formData.name,
            desc: formData.desc,
            price: formData.price,
            quantity: formData.quantity
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(function(response) {
        if (response.status == 404 || response.status == 400){
            alertbootstrap("danger", `Item ${formData.id}: Failed to Edit! Status: ${response.status}: ${response.statusText}`);
            return;
        }
        alertbootstrap("success", `Item ${formData.id}: Editted! Status: ${response.status}: ${response.statusText}`, redirect=true);
    })
    .catch(error => {
        console.log(error);
        alertbootstrap("danger", `Item ${formData.id}: Failed to Edit! Backend Error: ${error}`);
    });
}

// bootstrap alert, redirects page if redirect=true
function alertbootstrap(type, content, redirect=false)
{
    // define alert after redirect tthrough url parameters
    if (redirect)
        location.href=`items.html?alert=true&type=${type}&content=${content}`;
    else{
        let app = document.getElementById('root');
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
}


