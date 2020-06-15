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
        user: {
            firstName: '',
            lastName: '',
            email: '',
            address: '',
            city: ''
        }
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
        globalCheck: function () {
            return !this.checkRegular(this.user.firstName) && !this.checkRegular(this.user.lastName) && !this.checkRegular(this.user.city) && !this.checkEmail(this.user.email) && this.cardItems.length > 0;
        },
        checkEmail: function (value) {
            regex_email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
                    window.location.replace("405.html");
                });
            }
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
        },
        totalPrice: function () {
            let total = 0;
            this.cardItems.forEach(element => {
                total += element.price;
            });
            return total / 1000;
        }
    }
});