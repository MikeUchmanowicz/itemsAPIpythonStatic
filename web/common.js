nav = document.getElementById('nav');

//insert a navbar template from navbar.html
fetch('navbar.html')
    .then(response => response.text())
    .then(data => {
        nav.innerHTML = data;
    },
);