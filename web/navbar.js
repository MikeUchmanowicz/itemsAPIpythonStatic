let nav = document.getElementById('nav');

let navbar = 
`
<nav class="navbar navbar-expand-md navbar-light bg-light">
    <a class="navbar-brand" href="#">Demo</a>

    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">
            <a class="nav-item nav-link active" href="index.html">Home</a>
            <a class="nav-item nav-link active" href="items.html">Items</a>
            <a class="nav-item nav-link active" href="create.html">Create Item</a>
            <a class="nav-item nav-link active" href="edit.html">Edit Item</a>
        </div>
    </div>
</nav>
`;

nav.innerHTML = navbar;
