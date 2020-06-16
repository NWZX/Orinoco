const server = "http://207.180.251.133:4000";
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
        products: [],
        loadItems: true,
        cardItems: [],

        //All page with nav
        toggleMobileNav: false
    },
    mounted() {
        axios.get(server + '/api/furniture')
            .then(response => {
                this.products = response.data;
                this.loadItems = false;
            }).catch(() => {
                window.location.replace("404.html");
            });
        this.cardItems = GetCardItems();
    },
    methods: {
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
        }
    },
    computed: {
        cardItemNumber: function () {
            return this.cardItems.length;
        }
    }
});