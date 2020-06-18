function massiveSimClick(func, number) {
    for (let index = 0; index < number; index++) {
        func.click();
    }
}
function clean() {
    localStorage.setItem("cart", "[]");
}

describe('Product', function () {
    it("Get ID", function (done) {
        expect(parameter.id).to.equal("5be9cc611c9d440000c1421e");
        done();
    });
    it("Get products from API", function (done) {
        expect(typeof appProduct.$data.product).to.equal('object');
        expect(appProduct.$data.product._id).to.equal(parameter.id);
        done();
    });
    it("Card localstorage is set", function (done) {
        expect(localStorage.getItem("cart")).to.equal("[]");
        done();
    });

    it("Loading is finish", function (done) {
        expect(appProduct.$data.loadItem).to.equal(false);
        done();
    });

    it("Quantity is initializated", function (done) {
        expect(appProduct.$data.quantity).to.equal(1);
        done();
    });
    it("Add 310 element", function (done) {
        massiveSimClick(appProduct.$refs.addBtn, 310)
        expect(appProduct.$data.quantity).to.equal(300);
        done();
    });
    it("Remove 310 element", function (done) {
        massiveSimClick(appProduct.$refs.delBtn, 310)
        expect(appProduct.$data.quantity).to.equal(1);
        done();
    });
    it("Add to Card 50 item", function (done) {
        massiveSimClick(appProduct.$refs.addCart, 50)
        expect(appProduct.$data.cardItems.length).to.equal(50);
        expect(GetCardItems().length == appProduct.$data.cardItems.length).to.equal(true);
        clean();
        done();
    });
});