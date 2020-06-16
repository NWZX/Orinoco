const server = "http://207.180.251.133:4000";

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
/**
 * Compute the number of each item and return a type of Dictionary 
 * @param {array} array 
 */
function NumberOfItem(array) {
    if (array.length > 0 && array[0] != "") {
        var count = {};
        array.forEach(val => count[val.id] = (count[val.id] || 0) + 1);
        return Object.entries(count);
    }
    else {
        return [];
    }
}

var app = new Vue({
    el: '#app',
    data: {
        //List of required product from API
        products: [],
        //List of item in cart
        cardItems: [],
        //¯\_(ツ)_/¯
        totalPrice: 0,

        //All page with nav
        toggleMobileNav: false
    },
    mounted() {
        this.cardItems = GetCardItems();
        let countResult = NumberOfItem(this.cardItems);
        if (countResult.length > 0) {
            this.computeTotalPrice();
            for (let [key, value] of countResult) {
                axios.get(server + '/api/furniture/' + key)
                    .then(response => {
                        response.data.quantity = value;
                        this.products.push(response.data);
                    }).catch(() => {
                        window.location.replace("404.html");
                    });
            }
        }
    },
    methods: {
        /**
         * Get the event generete by the button &
         * Update the product quantity (Positive)
         * @param {event} e 
         * @param {string} id Product Id
         */
        AddItemQ: function (e, id) {
            let found = this.products.find(element => element._id == id)
            if (found.quantity < 300) {
                found.quantity += 1;
                this.AddToCard(id);
                this.computeTotalPrice();
            }
        },
        /**
        * Get the event generete by the button &
        * Update the product quantity (Negative)
        * If the quantity is null => remove the product 
        * @param {event} e
        * @param {string} id Product Id
        */
        SubItemQ: function (e, id) {
            let found = this.products.find(element => element._id == id)
            if (found.quantity > 0) {
                found.quantity -= 1;
                this.PopToCard(id);
                this.computeTotalPrice();
                if (found.quantity == 0) {
                    this.PopToProducts(id);
                }
            }
        },
        /**
         * Add one item to the card
         * @param {string} id 
         */
        AddToCard: function (id) {
            let found = this.products.find(element => element._id == id)
            let price = found.price;
            this.cardItems.push({ id, price });
            localStorage.setItem("cart", JSON.stringify(this.cardItems));
        },
        /**
        * Remove the id item from the card
        * @param {string} id
        */
        PopToCard: function (id) {
            let arr = this.cardItems;
            let i = arr.map(function (e) { return e.id; }).indexOf(id);
            if (i > -1) {
                arr.splice(i, 1);
            }
            localStorage.setItem("cart", JSON.stringify(arr));
        },
        /**
         * Remove the id item from the products list
         * @param {string} id 
         */
        PopToProducts: function (id) {
            let arr = this.products;
            let i = arr.map(function (e) { return e._id; }).indexOf(id);
            if (i > -1) {
                arr.splice(i, 1);
            }
        },
        /**
         * Compute the total price ¯\_(ツ)_/¯
         */
        computeTotalPrice: function () {
            let total = 0;
            this.cardItems.forEach(element => {
                total += element.price;
            });
            this.totalPrice = total / 1000;
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
    },
    computed: {
        /**
        * Return the number of item in cart
        */
        cardItemNumber: function () {
            return this.cardItems.length;
        },
    }
});