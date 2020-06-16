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

let parameter = getParameter();
if (parameter.orderId == null)
    window.location.replace("404.html");

var app = new Vue({
    el: '#app',
    data: {
        //¯\_(ツ)_/¯
        orderId: "",
        //List of item in cart
        cardItems: [],

        //All page with nav
        toggleMobileNav: false
    },
    mounted() {
        this.orderId = parameter.orderId;
        this.cardItems = GetCardItems();
    },
    methods: {
        /**
         * Send user to home page
         */
        GoHome: function () {
            window.location.replace("index.html");
        },
        /**
        * Control mobile nav display
        */
        activeNav: function () {
            this.toggleMobileNav = !this.toggleMobileNav;
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