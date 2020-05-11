const regex_email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const regex_name = /\d/;
const server = "http://207.180.251.133:4000";

let app = (window.app = {});
app.pages = {};
app.tool = {};
app.auxiliary = {};
app.http = {};
app.url = {};
app.goto = {};

app.goto.home = function () { window.location.replace("index.html"); };
app.goto.notFound = function () { window.location.replace("404.html"); };

/**
 * Transform API price format to regular format
 *
 * @param {number} price
 * @returns {number}
 */
app.tool.price = function (price) {
    price /= 1000;
    return price;
}
/**
 * Count the number of time a item exist in array
 * Return a dictionnary with key : id and value : number of item
 *
 * @param {*} array
 * @returns
 */
app.auxiliary.cartItemLister = function (array) {
    if (array.length > 0 && array[0] != "") {
        var count = {};
        array.forEach(val => count[val] = (count[val] || 0) + 1);
        return Object.entries(count);
    }
    else {
        return [];
    }
}
app.auxiliary.cartItemNumber = function () {
    let element = document.getElementById('nb_cart_item');
    if (localStorage.getItem("cart") === null || localStorage.getItem("cart").length == 0) {
        element.innerHTML = "(0)";
    }
    else {
        element.innerHTML = '(' + localStorage.getItem("cart").split(',').length + ')';
    }
}
app.auxiliary.updatePrice = function (response) {
    let result = 0;
    let cart = localStorage.getItem("cart").split(",");
    for (let [key, value] of app.auxiliary.cartItemLister(cart)) {
        const ele = response.find(n => n._id == key);
        result += value * app.tool.price(ele.price);
    }
    let summary = document.getElementsByClassName('summary-table');
    summary[0].innerHTML = '<li><span>subtotal:</span> <span>$' + result.toFixed(2) + '</span></li>' +
        '<li><span>delivery:</span> <span>Free</span></li>' +
        '<li><span>total:</span> <span>$' + result.toFixed(2) + '</span></li>';
}
app.auxiliary.numberPicker = function (id, add) {
    let effect = document.getElementById('qty' + id);
    let qty = effect.value;
    if (add == false && !isNaN(qty) && qty > 0) {
        effect.value--;
        let cart = localStorage.getItem("cart").split(",");
        cart.splice(cart.indexOf(id.toString()), 1);
        localStorage.setItem("cart", cart.toString());
    }
    if (add == true && !isNaN(qty) && qty <= 300) {
        effect.value++;
        let cart = localStorage.getItem("cart").split(",");
        cart.push(id);
        localStorage.setItem("cart", cart.toString());
    }
    app.auxiliary.cartItemNumber();
    app.auxiliary.updatePrice();
    return false;
}
app.auxiliary.validCheckout = function (key, RL = true) {
    let e;
    switch (key) {
        case 1:
            e = document.getElementById("first_name");
            var fname = e.value; // Valeur saisie dans le champ mdp
            var i_fname = document.getElementById("invalid_fname");
            if (fname != "" && regex_name.test(fname)) {
                i_fname.textContent = "Invalid first name"; // Texte de l'aide
                return false;
            }
            else if (!RL && fname == "") {
                i_fname.textContent = "First name required";
                return false;
            }
            else {
                i_fname.textContent = "";
            }

            e = document.getElementById("last_name");
            var lname = e.value; // Valeur saisie dans le champ mdp
            var i_lname = document.getElementById("invalid_lname");
            if (lname != "" && regex_name.test(lname)) {
                i_lname.textContent = "Invalid last name"; // Texte de l'aide
                return false;
            }
            else if (!RL && lname == "") {
                i_lname.textContent = "Last name required";
                return false;
            }
            else {
                i_lname.textContent = "";
            }
            break;
        case 2:
            e = document.getElementById("email");
            var email = e.value; // Valeur saisie dans le champ mdp
            var i_email = document.getElementById("invalid_email");
            if (email != "" && !regex_email.test(email)) {
                i_email.textContent = "Email invalid"; // Texte de l'aide
                return false;
            }
            else if (!RL && email == "") {
                i_email.textContent = "Email required";
                return false;
            }
            else {
                i_email.textContent = "";
            }
            break;
        case 3:
            e = document.getElementById("street_address");
            var addr = e.value; // Valeur saisie dans le champ mdp
            var i_addr = document.getElementById("invalid_addr");
            if (!RL && addr == "") {
                i_addr.textContent = "Address required";
                return false;
            }
            else {
                i_addr.textContent = "";
            }
            break;
        case 4:
            e = document.getElementById("city");
            var city = e.value; // Valeur saisie dans le champ mdp
            var i_city = document.getElementById("invalid_city");
            if (lname != "" && regex_name.test(city)) {
                i_city.textContent = "Invalid city"; // Texte de l'aide
                return false;
            }
            else if (!RL && city == "") {
                i_city.textContent = "City required";
                return false;
            }
            else {
                i_city.textContent = "";
            }
            break;

        default:
            return app.auxiliary.validCheckout(1, RL) && app.auxiliary.validCheckout(2, RL) && app.auxiliary.validCheckout(3, RL) && app.auxiliary.validCheckout(4, RL);
    }
    return true;
}
app.http.getAsync = function (theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE) {
            if (this.status == 200) {
                callback(JSON.parse(this.responseText));
            }
            else if (this.status == 400)
                alert("API request error");
            else if (this.status == 404) {
                app.goto.notFound();
            }
            else if (this.status == 500)
                alert("API request error");
        }

    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send();
}
app.http.postAsync = function (theUrl, object, callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE) {
            if (this.status == 201)
                callback(JSON.parse(this.responseText));
            else if (this.status == 400)
                alert("API request error");
        }
    }
    request.open("POST", theUrl, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(object));
}
app.pages.index = function (response) {
    let contents = document.getElementById('amado-pro-catagory');
    let loader = document.getElementById('amado-load');
    let container = document.getElementsByClassName('products-catagories-area');
    for (let index = 0; index < response.length; index++) {
        const ele = response[index];
        contents.innerHTML += '<div class="single-products-catagory clearfix">' +
            '<a href="product-details.html?id=' + ele._id + '">' +
            '<img src="' + ele.imageUrl + '" alt="">' +
            '<div class="hover-content">' +
            '<div class="line"></div>' +
            '<p>From $' + app.tool.price(ele.price) + '</p>' +
            '<h4>' + ele.name + '</h4>' +
            '</div>' +
            '</a>' +
            '</div>';
    }
    (function ($) {
        'use strict';

        var $window = $(window);

        // :: 1.0 Masonary Gallery Active Code

        var proCata = $('.amado-pro-catagory');
        var singleProCata = ".single-products-catagory";

        if ($.fn.imagesLoaded) {
            proCata.imagesLoaded(function () {
                container[0].style.display = "block";
                contents.style.display = "block";
                loader.style.display = "none";
                proCata.isotope({
                    itemSelector: singleProCata,
                    percentPosition: true,
                    masonry: {
                        columnWidth: singleProCata
                    }
                });
            });
        }

    })(jQuery);
}
app.pages.product = function (response) {
    let ele = response;
    let loader = document.getElementById('amado-load');
    let container = document.getElementsByClassName('single-product-area');

    let d_title = document.getElementById('detail_title');
    let d_title_nav = document.getElementById('nav_title');
    let d_title_global = document.getElementsByTagName('title');
    d_title.innerHTML = ele.name;
    d_title_nav.innerHTML = ele.name;
    d_title_global[0].innerHTML += ele.name;

    let d_desc = document.getElementById('detail_desc');
    d_desc.innerHTML = ele.description;

    let d_price = document.getElementById('detail_price');
    d_price.innerHTML = "$" + app.tool.price(ele.price);

    let d_img = document.getElementsByClassName('carousel-inner');
    d_img[0].innerHTML = '<div class="carousel-item active">' +
        '<a class="gallery_img" href="' + ele.imageUrl + '">' +
        '<img class="d-block w-100" src="' + ele.imageUrl + '" alt="First slide">' +
        '</a>' +
        '</div>';

    let d_img_mini = document.getElementsByClassName('carousel-indicators');
    d_img_mini[0].innerHTML = '<li class="active" data-target="#product_details_slider" data-slide-to="0"' +
        'style = "background-image: url(' + ele.imageUrl + ');" >' +
        '</li >';

    let btn = document.getElementById('checkout');
    btn.addEventListener('click', function () {          // On écoute l'événement click
        let effect = document.getElementById('qty');
        let qty = effect.value;
        while (qty > 0) {
            if (localStorage.getItem("cart") === null || localStorage.getItem("cart").length == 0) {
                let array = app.url.parameter().id;
                localStorage.setItem("cart", array);
            }
            else {
                let array = localStorage.getItem("cart");
                localStorage.setItem("cart", array + "," + app.url.parameter().id);
            }
            qty--;
        }
        // On change le contenu de notre élément pour afficher "C'est cliqué !"
    });
    container[0].style.display = "block";
    loader.style.display = "none";
}
app.pages.cart = function (response) {
    let cart_element = app.auxiliary.cartItemLister(localStorage.getItem("cart").split(","));
    if (cart_element.length > 0) {
        let contents = document.getElementById('cart-element');
        for (let [key, value] of cart_element) {
            const ele = response.find(n => n._id == key);
            if (value > 300) {
                value = 300;
            }
            contents.innerHTML += '<tr>' +
                '<td class="cart_product_img">' +
                '<a href="#"><img src="' + ele.imageUrl + '" alt="Product"></a>' +
                '</td>' +
                '<td class="cart_product_desc">' +
                '<h5>' + ele.name + '</h5>' +
                '</td>' +
                '<td class="price">' +
                '<span>$' + app.tool.price(ele.price) + '</span>' +
                '</td>' +
                '<td class="qty">' +
                '<div class="qty-btn d-flex">' +
                '<p>Qty</p>' +
                '<div class="quantity">' +
                '<span class="qty-minus" onclick="app.auxiliary.numberPicker(' + key + ', false);"><i class="fa fa-minus" aria-hidden="true"></i></span>' +
                '<input type="number" class="qty-text" id="qty' + key + '" step="1" min="0" max="300" name="quantity" value="' + value + '">' +
                '<span class="qty-plus" onclick="app.auxiliary.numberPicker(' + key + ', true);"><i class="fa fa-plus" aria-hidden="true"></i></span>' +
                '</div>' +
                '</div>' +
                '</td>' +
                '</tr>';
        }
        document.getElementsByClassName("cart-btn")[0].style.display = "block";
    }
    app.auxiliary.updatePrice(response);
}
app.pages.checkout = function (response) {
    document.getElementById("first_name").addEventListener("input", function (e) {
        app.auxiliary.validCheckout(1);
    });
    document.getElementById("last_name").addEventListener("input", function (e) {
        app.auxiliary.validCheckout(1);
    });
    document.getElementById("email").addEventListener("input", function (e) {
        app.auxiliary.validCheckout(2);
    });
    document.getElementById("street_address").addEventListener("input", function (e) {
        app.auxiliary.validCheckout(3);
    });
    document.getElementById("city").addEventListener("input", function (e) {
        app.auxiliary.validCheckout(4);
    });
    document.getElementById('checkout').addEventListener('click', function () {
        if (app.auxiliary.validCheckout(0, false)) {
            let contact = {
                firstName: document.getElementById("first_name").value,
                lastName: document.getElementById("last_name").value,
                address: document.getElementById("street_address").value,
                city: document.getElementById("city").value,
                email: document.getElementById("email").value
            }
            let products = localStorage.getItem("cart").split(",");
            let object = { contact, products }

            app.http.postAsync(server + "/api/furniture/order", object, app.pages.success)
        }
    });

    app.auxiliary.updatePrice(response);
}
app.pages.success = function (response) {
    localStorage.setItem("cart", "");
    window.location.replace("success.html?orderId=" + response.orderId);
}
app.url.parameter = function () {
    var urlParams,
        match,
        pl = /\+/g, // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl)); },
        query = window.location.search.substring(1);
    urlParams = {};
    while (match = search.exec(query))
        urlParams[decode(match[1])] = decode(match[2]);
    return urlParams;
}

app.auxiliary.cartItemNumber();
//Recupéré la liste des produit
let pages = location.pathname.split("/").slice(-1);

if (pages[0] == "index.html") {
    app.http.getAsync(server + "/api/furniture", app.pages.index);
}
else if (pages[0] == "product-details.html") {
    let parameter = app.url.parameter();
    if (parameter.id != null)
        app.http.getAsync(server + "/api/furniture/" + parameter.id, app.pages.product);
    else
        app.goto.notFound();
}
else if (pages[0] == "cart.html" && localStorage.getItem("cart") != null) {
    app.http.getAsync(server + "/api/furniture", app.pages.cart);
}
else if (pages[0] == "checkout.html") {
    app.http.getAsync(server + "/api/furniture", app.pages.checkout);
    let req = new XMLHttpRequest();
}
else if (pages[0] == "success.html") {
    let parameter = app.url.parameter();
    if (parameter.orderId != null) {
        let order = document.getElementById("order-id");
        order.innerHTML = parameter.orderId;
    }
    else {
        app.goto.home();
    }
}
else {
    app.goto.notFound();
}