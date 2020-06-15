const server = "http://207.180.251.133:4000";
function GetCardItems() {
    if (localStorage.getItem("cart") === null)
        localStorage.setItem("cart", "");
    if (localStorage.getItem("cart") == "")
        return [];

    return JSON.parse(localStorage.getItem("cart"));
}
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
        products: [],
        cardItems: [],
        totalPrice: 0
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
        AddItemQ: function (e, id) {
            let found = this.products.find(element => element._id == id)
            if (found.quantity < 300) {
                found.quantity += 1;
                this.AddToCard(id);
                this.computeTotalPrice();
            }
        },
        SubItemQ: function (e, id) {
            let found = this.products.find(element => element._id == id)
            if (found.quantity > 0) {
                found.quantity -= 1;
                this.PopToCard(id);
                this.computeTotalPrice();
            }
        },
        AddToCard: function (id) {
            let found = this.products.find(element => element._id == id)
            let price = found.price;
            this.cardItems.push({ id, price });
            localStorage.setItem("cart", JSON.stringify(this.cardItems));
        },
        PopToCard: function (id) {
            let arr = this.cardItems;
            let i = arr.map(function (e) { return e.id; }).indexOf(id);
            if (i > -1) {
                arr.splice(i, 1);
            }
            localStorage.setItem("cart", JSON.stringify(arr));
        },
        computeTotalPrice: function () {
            let total = 0;
            this.cardItems.forEach(element => {
                total += element.price;
            });
            this.totalPrice = total / 1000;
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
        },
    }
});