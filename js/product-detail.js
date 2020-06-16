const server = "http://207.180.251.133:4000";
let parameter = getParameter();
if (parameter.id == null)
    window.location.replace("404.html");

function getParameter() {
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
function GetCardItems() {
    if (localStorage.getItem("cart") === null)
        localStorage.setItem("cart", "");
    if (localStorage.getItem("cart") == "")
        return [];

    return JSON.parse(localStorage.getItem("cart"));
}

var app = new Vue({
    el: '#app',
    data: {
        product: {},
        loadItem: true,
        cardItems: [],
        quantity: 1,

        //All page with nav
        toggleMobileNav: false
    },
    mounted() {
        axios.get(server + '/api/furniture/' + parameter.id)
            .then(response => {
                this.product = response.data;
                this.loadItem = false;
                document.title = 'Orinoco - ' + response.data.name;
            }).catch(() => {
                window.location.replace("404.html");
            });
        this.cardItems = GetCardItems();
    },
    methods: {
        AddItemQ: function (e) {
            if (typeof this.quantity === 'string')
                this.quantity = parseInt(this.quantity);

            if (this.quantity < 300) {
                this.quantity += 1;
            }
        },
        SubItemQ: function (e) {
            if (typeof this.quantity === 'string')
                this.quantity = parseInt(this.quantity);

            if (this.quantity > 1) {
                this.quantity -= 1;
            }
        },
        AddToCard: function (e) {
            let id = this.product._id;
            let price = this.product.price;
            for (let index = 0; index < this.quantity; index++) {
                this.cardItems.push({ id, price });
            }

            localStorage.setItem("cart", JSON.stringify(this.cardItems));
            return false;
        },
        activeNav: function () {
            this.toggleMobileNav = !this.toggleMobileNav;
        }
    },
    filters: {
        truePrice: function (value) {
            return value / 1000;
        },
        productUrl: function (value) {
            return 'product-details.html?id=' + value;
        },
        styleBackground: function (value) {
            return { backgroundImage: 'url(' + value + ')' };
        }
    },
    computed: {
        cardItemNumber: function () {
            return this.cardItems.length;
        }
    }
});