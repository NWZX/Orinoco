function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}

describe('Checkout', function () {

    it("CardItems is set", function (done) {
        expect(JSON.stringify(appCheckout.$data.cardItems)).to.equal('[{"id":"5be9cc611c9d440000c1421e","price":59900},{"id":"5beaadda1c9d440000a57d98","price":89900}]');
        done();
    });
    it("CheckRegular (with correct value)", function (done) {
        expect(appCheckout.$options.methods.checkRegular("David")).to.equal(false);
        done();
    });
    it("Check Regular (with incorrect value)", function (done) {
        expect(appCheckout.$options.methods.checkRegular("David52")).to.equal(true);
        done();
    });
    it("Check Email (with correct value)", function (done) {
        expect(appCheckout.$options.methods.checkEmail("david@gmail.com")).to.equal(false);
        done();
    });
    it("Check Email (with incorrect value)", function (done) {
        expect(appCheckout.$options.methods.checkEmail("david.outlook.com")).to.equal(true);
        done();
    });
    it("Global Check", function (done) {
        expect(appCheckout.$refs.Check.innerText).to.equal("false");
        appCheckout.$data.user = {
            firstName: 'David',
            lastName: 'Cian',
            email: 'david@gmail.com',
            address: '25 rue du Maronage',
            city: 'Riveport'
        }
        appCheckout.$nextTick(() => {
            expect(appCheckout.$refs.Check.innerText).to.equal("true");
            done();
        })
    });

});