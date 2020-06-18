const server = "http://207.180.251.133:4000";
/**
 * Get parameter from url
 */
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
let parameter = getParameter();
if (typeof parameter === 'undefined' || parameter.id == null)
    window.location.replace("404.html");
/**
 * Extract cart data from localStorage
 */
function GetCardItems() {
    if (localStorage.getItem("cart") === null)
        localStorage.setItem("cart", "");
    if (localStorage.getItem("cart") == "")
        return [];

    return JSON.parse(localStorage.getItem("cart"));
}

var appProduct = new Vue({
    el: '#app',
    data: {
        //Product data from API
        product: {},
        //Toogle for loading animation
        loadItem: true,
        //List of item in cart
        cardItems: [],
        //Quantity of product
        quantity: 1,

        //All page with nav
        toggleMobileNav: false
    },
    mounted() {
        //Get data from API
        axios.get(server + '/api/furniture/' + parameter.id)
            .then(response => {
                this.product = response.data;
                this.loadItem = false;
                document.title = 'Orinoco - ' + response.data.name;
            }).catch(() => {
                window.location.replace("404.html");
            });
        //Initialize cardItems list
        this.cardItems = GetCardItems();
    },
    methods: {
        /**
        * Get the event generete by the button &
        * Update the product quantity (Positive)
        * @param {event} e
        */
        AddItemQ: function (e) {
            if (typeof this.quantity === 'string')
                this.quantity = parseInt(this.quantity);

            if (this.quantity < 300) {
                this.quantity += 1;
            }
        },
        /**
        * Get the event generete by the button &
        * Update the product quantity (Negative)
        * @param {event} e
        */
        SubItemQ: function (e) {
            if (typeof this.quantity === 'string')
                this.quantity = parseInt(this.quantity);

            if (this.quantity > 1) {
                this.quantity -= 1;
            }
        },
        /**
         * Add the quantity of items to the card
         * @param {event} e 
         */
        AddToCard: function (e) {
            let id = this.product._id;
            let price = this.product.price;
            for (let index = 0; index < this.quantity; index++) {
                this.cardItems.push({ id, price });
            }

            localStorage.setItem("cart", JSON.stringify(this.cardItems));
            return false;
        },
        /**
        * Control mobile nav display
        */
        activeNav: function () {
            this.toggleMobileNav = !this.toggleMobileNav;
        }
    },
    filters: {
        /**
        * Format conversion
        * @param {number} value
        */
        truePrice: function (value) {
            return value / 1000;
        },
        /**
        * Return custom style for img item
        * @param {number} value
        */
        styleBackground: function (value) {
            return { backgroundImage: 'url(' + value + ')' };
        }
    },
    computed: {
        /**
        * Return the number of item in cart
        */
        cardItemNumber: function () {
            return this.cardItems.length;
        }
    }
});