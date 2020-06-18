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

var appCheckout = new Vue({
    el: '#app',
    data: {
        //List of item in cart
        cardItems: [],
        //Form data
        user: {
            firstName: '',
            lastName: '',
            email: '',
            address: '',
            city: ''
        },

        //All page with nav
        toggleMobileNav: false
    },
    mounted() {
        this.cardItems = GetCardItems();
    },
    methods: {
        /**
         * Test if there has any number
         * @param {string} value 
         */
        checkRegular: function (value) {
            regex_name = /\d/;
            if (value != "" && regex_name.test(value)) {
                return true;
            }
            else if (value == "") {
                return true;
            }
            else {
                return false;
            }
        },
        /**
         * Test all the tested entry
         */
        globalCheck: function () {
            return !this.checkRegular(this.user.firstName) && !this.checkRegular(this.user.lastName) && !this.checkRegular(this.user.city) && !this.checkEmail(this.user.email) && this.cardItems.length > 0;
        },
        /**
         * Test if it's a email
         * @param {*} value 
         */
        checkEmail: function (value) {
            regex_email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            if (value != "" && !regex_email.test(value)) {
                return true;
            }
            else if (value == "") {
                return true;
            }
            else {
                return false;
            }
        },
        /**
         * Send formated & tested data to API
         */
        sendData: function () {
            if (this.globalCheck()) {
                let contact = {
                    firstName: this.user.firstName,
                    lastName: this.user.lastName,
                    email: this.user.email,
                    address: this.user.address,
                    city: this.user.city
                };

                let products = [];
                this.cardItems.forEach(element => {
                    products.push(element.id);
                });

                axios.post(server + '/api/furniture/order', { contact, products }).then(response => {
                    localStorage.setItem("cart", "");
                    window.location.replace("success.html?orderId=" + response.data.orderId);
                }).catch(() => {
                    window.location.replace("404.html");
                });
            }
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
        /**
         * Compute the total price ¯\_(ツ)_/¯
         */
        totalPrice: function () {
            let total = 0;
            this.cardItems.forEach(element => {
                total += element.price;
            });
            return total / 1000;
        }
    }
});