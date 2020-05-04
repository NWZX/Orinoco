const regex_email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const regex_name = /\d/;
const server = "http://207.180.251.133:4000";

function scrap_price(price) {
    price /= 1000;
    return price;
}
function Counter(array) {
    var count = {};
    array.forEach(val => count[val] = (count[val] || 0) + 1);
    return Object.entries(count);
}
function qtyObject(id, add) {
    let effect = document.getElementById('qty' + id);
    let qty = effect.value;
    if (add == false && !isNaN(qty) && qty > 0) {
        effect.value--;
        let card = localStorage.getItem("card").split(",");
        card.splice(card.indexOf(id.toString()), 1);
        localStorage.setItem("card", card.toString());
    }
    if (add == true && !isNaN(qty) && qty <= 300) {
        effect.value++;
        let card = localStorage.getItem("card").split(",");
        card.push(id);
        localStorage.setItem("card", card.toString());
    }
    count_card_item();
    UR_price();
    return false;
}
function UR_price(response) {
    let result = 0;
    let card = localStorage.getItem("card").split(",");
    for (let [key, value] of Counter(card)) {
        const ele = response.find(n => n._id == key);;
        result += value * scrap_price(ele.price);
    }
    let summary = document.getElementsByClassName('summary-table');
    summary[0].innerHTML = '<li><span>subtotal:</span> <span>$' + result.toFixed(2) + '</span></li>' +
        '<li><span>delivery:</span> <span>Free</span></li>' +
        '<li><span>total:</span> <span>$' + result.toFixed(2) + '</span></li>';
}
function count_card_item() {
    let element = document.getElementById('nb_card_item');
    if (localStorage.getItem("card") === null || localStorage.getItem("card").length == 0) {
        element.innerHTML = "(0)";
    }
    else {
        element.innerHTML = '(' + localStorage.getItem("card").split(',').length + ')';
    }
}
function valid_checkout(key, RL = true) {
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
            return valid_checkout(1, RL) && valid_checkout(2, RL) && valid_checkout(3, RL) && valid_checkout(4, RL);
    }
    return true;
}
function define_product(id) {
    localStorage.setItem("product", id);
}
function clean() {
    localStorage.setItem("card", "");
    window.location.replace("index.html");
}
function utf8_to_b64(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
}
function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200)
            callback(JSON.parse(this.responseText));
        else if (this.status == 400)
            alert("API request error");
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send();
}
function httpPostAsync(theUrl, object, callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 201)
            callback();
        else if (this.status == 400)
            alert(this.responseText);
    }
    request.open("POST", theUrl, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(object));
}
function index(response) {
    for (let index = 0; index < response.length; index++) {
        const ele = response[index];
        contents.innerHTML += '<div class="single-products-catagory clearfix">' +
            '<a href="product-details.html" onclick="define_product(\'' + ele._id + '\')">' +
            '<img src="' + ele.imageUrl + '" alt="">' +
            '<div class="hover-content">' +
            '<div class="line"></div>' +
            '<p>From $' + scrap_price(ele.price) + '</p>' +
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
function product_detail(response) {
    let ele = response;

    let d_title = document.getElementById('detail_title');
    let d_title_nav = document.getElementById('nav_title');
    d_title.innerHTML = ele.name;
    d_title_nav.innerHTML = ele.name;

    let d_desc = document.getElementById('detail_desc');
    d_desc.innerHTML = ele.description;

    let d_price = document.getElementById('detail_price');
    d_price.innerHTML = "$" + scrap_price(ele.price);

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
            if (localStorage.getItem("card") === null || localStorage.getItem("card").length == 0) {
                let array = localStorage.getItem("product");
                localStorage.setItem("card", array);
            }
            else {
                let array = localStorage.getItem("card");
                localStorage.setItem("card", array + "," + localStorage.getItem("product"));
            }
            qty--;
        }
        // On change le contenu de notre élément pour afficher "C'est cliqué !"
    });
}
function card(response) {
    let card_element = Counter(localStorage.getItem("card").split(","));
    let contents = document.getElementById('card-element');
    for (let [key, value] of card_element) {
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
            '<span>$' + scrap_price(ele.price) + '</span>' +
            '</td>' +
            '<td class="qty">' +
            '<div class="qty-btn d-flex">' +
            '<p>Qty</p>' +
            '<div class="quantity">' +
            '<span class="qty-minus" onclick="qtyObject(' + key + ', false);"><i class="fa fa-minus" aria-hidden="true"></i></span>' +
            '<input type="number" class="qty-text" id="qty' + key + '" step="1" min="0" max="300" name="quantity" value="' + value + '">' +
            '<span class="qty-plus" onclick="qtyObject(' + key + ', true);"><i class="fa fa-plus" aria-hidden="true"></i></span>' +
            '</div>' +
            '</div>' +
            '</td>' +
            '</tr>';
    }
    UR_price(response);
}
function checkout(response) {
    document.getElementById("first_name").addEventListener("input", function (e) {
        valid_checkout(1);
    });
    document.getElementById("last_name").addEventListener("input", function (e) {
        valid_checkout(1);
    });
    document.getElementById("email").addEventListener("input", function (e) {
        valid_checkout(2);
    });
    document.getElementById("street_address").addEventListener("input", function (e) {
        valid_checkout(3);
    });
    document.getElementById("city").addEventListener("input", function (e) {
        valid_checkout(4);
    });
    document.getElementById('checkout').addEventListener('click', function () {
        if (valid_checkout(0, false)) {
            let contact = {
                firstName: document.getElementById("first_name").value,
                lastName: document.getElementById("last_name").value,
                address: document.getElementById("street_address").value,
                city: document.getElementById("city").value,
                email: document.getElementById("email").value
            }
            let products = localStorage.getItem("card").split(",");
            let orderid = utf8_to_b64((new Date()).getTime().toString() + (Math.random() * 10000000).toString());
            let object = { contact, products, orderid }

            httpPostAsync(server + "/api/furniture/order", object, clean)
        }
    });

    UR_price(response);
}

count_card_item();
//Recupéré la liste des produit
let pages = location.pathname.split("/").slice(-1);
let contents = document.getElementById('amado-pro-catagory');

if (pages[0] == "index.html") {
    httpGetAsync(server + "/api/furniture", index)
}

else if (pages[0] == "product-details.html" && localStorage.getItem("product") != null) {
    httpGetAsync(server + "/api/furniture/" + localStorage.getItem("product"), product_detail)
}

else if (pages[0] == "cart.html" && localStorage.getItem("card") != null) {
    httpGetAsync(server + "/api/furniture", card)
}

else if (pages[0] == "checkout.html") {
    httpGetAsync(server + "/api/furniture", checkout)
    let req = new XMLHttpRequest();
}
else {
    window.location.replace("index.html");
}