describe('Index', function () {

    it("Get products from API", function (done) {
        expect(appIndex.$data.products.length).to.equal(5);
        expect(appIndex.$data.products[0]._id).to.equal("5be9cc611c9d440000c1421e");
        done();
    });

    it("Loading is finish", function (done) {
        expect(appIndex.$data.loadItems).to.equal(false);
        done();
    });

    it("Card localstorage is set", function (done) {
        expect(localStorage.getItem("cart")).to.equal("[]");
        done();
    });

    it("Product url is well formated", function (done) {
        expect(appIndex.$options.filters.productUrl(appIndex.$data.products[0]._id)).to.equal("product-details.html?id=5be9cc611c9d440000c1421e");
        done();
    });

});
