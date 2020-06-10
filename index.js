const server = "http://207.180.251.133:4000";

var app = new Vue({
    el: '#app',
    data: {
        products: [],
        grid: false,
        load: true
    },
    mounted() {
        axios.get(server + '/api/furniture')
            .then(response => {
                this.products = response.data;
                this.grid = true;
                this.load = false;
            });
    },
    methods: {
    },
    computed: {
    }
});

setInterval(() => {
    var proCata = $('.amado-pro-catagory');
    var singleProCata = ".single-products-catagory";

    if ($.fn.imagesLoaded) {
        proCata.imagesLoaded(function () {
            proCata.isotope({
                itemSelector: singleProCata,
                percentPosition: true,
                masonry: {
                    columnWidth: singleProCata
                }
            });
        });
    }
}, 1000)