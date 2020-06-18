function massiveSimClick(func, number) {
    for (let index = 0; index < number; index++) {
        func.click();
    }
}
function clean() {
    localStorage.setItem("cart", "[]");
}

describe('Cart', function () {

    it("CardItems is set", function (done) {
        expect(JSON.stringify(appCart.$data.cardItems)).to.equal('[{"id":"5be9cc611c9d440000c1421e","price":59900},{"id":"5beaadda1c9d440000a57d98","price":89900}]');
        done();
    });

    it("Get products from API", function (done) {
        expect(appCart.$data.products.length).to.equal(2);
        expect(appCart.$data.products[0]._id).to.equal("5be9cc611c9d440000c1421e");
        done();
    });

    it("Quantity is initializated", function (done) {
        expect(appCart.$data.products[0].quantity).to.equal(1);
        done();
    });

    it("Check Total price", function (done) {
        expect(appCart.$data.totalPrice).to.equal(149.8);
        done();
    });

    it("Add 155 element", function (done) {
        massiveSimClick(appCart.$refs.addBtn[0], 155);
        expect(appCart.$data.products[0].quantity).to.equal(156);
        expect(appCart.$data.cardItems.length).to.equal(157);
        expect(GetCardItems().length).to.equal(157);
        done();
    });
    it("Remove 155 element", function (done) {
        massiveSimClick(appCart.$refs.delBtn[0], 155);
        expect(appCart.$data.products[0].quantity).to.equal(1);
        expect(appCart.$data.cardItems.length).to.equal(2);
        expect(GetCardItems().length).to.equal(2);
        done();
    });

    it("Remove 1 product", function (done) {
        appCart.$refs.delBtn[0].click();
        expect(appCart.$data.cardItems.length).to.equal(1);
        expect(GetCardItems().length).to.equal(1);
        expect(appCart.$data.products.length).to.equal(1);
        done();
    });



});