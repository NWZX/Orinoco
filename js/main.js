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