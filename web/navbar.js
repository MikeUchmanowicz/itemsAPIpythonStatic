let nav = document.getElementById('nav');

let navbar = 
`
<nav class="navbar navbar-expand-md navbar-light">
    <a class="navbar-brand" href="index.html"><b>Demo</b></a>

    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">
            <a class="nav-item nav-link" href="index.html"><i>Home</i></a>
            <a class="nav-item nav-link" href="items.html"><i>Items</i></a>
            <a class="nav-item nav-link" href="create.html"><i>Create Item</i></a>
            <a class="nav-item nav-link" href="edit.html"><i>Edit Item</i></a>
        </div>
    </div>
</nav>
`;

nav.innerHTML = navbar;
