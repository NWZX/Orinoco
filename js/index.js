const server = "http://207.180.251.133:4000";

/**
 * Extract cart data from localStorage
 */
function GetCardItems() {
    if (localStorage.getItem("cart") === null)
        localStorage.setItem("cart", "[]");

    return JSON.parse(localStorage.getItem("cart"));
}

var appIndex = new Vue({
    el: '#app',
    data: {
        //List of products form API
        products: [],
        //Toogle for loading animation
        loadItems: true,
        //List of item in cart
        cardItems: [],

        //All page with nav
        toggleMobileNav: false
    },
    mounted() {
        //Get data from API
        axios.get(server + '/api/furniture')
            .then(response => {
                this.products = response.data;
                this.loadItems = false;
            }).catch(() => {
                window.location.replace("404.html");
            });
        //Initialize cardItems list
        this.cardItems = GetCardItems();
    },
    methods: {
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
         * Return url to product page
         * @param {string} value 
         */
        productUrl: function (value) {
            return 'product-details.html?id=' + value;
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