app = document.getElementById('root');

const createForm = document.getElementById('createform');
const editForm = document.getElementById('editform');

if (createForm) {
    createForm.onsubmit = function (e) {
        e.preventDefault();
        handleCreate(createForm);
    };
}

function handleCreate(form)
{
    let data = new FormData(form);
    let formData = Object.fromEntries(data);
    
    fetch('http://127.0.0.1:8000/items/', {
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


if (editForm)
{
    editForm.onsubmit = function (e) {
        e.preventDefault();

        handleEdit(editForm);
    };
}

function handleEdit(form)
{
    let data = new FormData(form);
    let formData = Object.fromEntries(data);

    fetch('http://127.0.0.1:8000/items/'+ formData.id, {
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


function alertbootstrap(type, content, redirect=false)
{
    if (redirect)
        location.href=`items.html?alert=true&type=${type}&content=${content}`;
    else{
        const app = document.getElementById('root');
        const alert = document.createElement('div');
        alert.setAttribute('class', 'alert alert-' + type + ' alert-dismissible fade show');
        alert.setAttribute('role', 'alert');
        alert.textContent = content;
        app.prepend(alert);

        $(".alert").delay(2500).slideUp(1000, function() {
            $(this).alert('close');    
        });
    }
}


