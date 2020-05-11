import * as main from "main.js";

let test = (window.test = {});

test.method = {};
test.ui = {};

test.method.price = function () {
    describe("add method", () => {

        // 3. A unit test
        it("should return 2", () => {
          // 4. An assertion
          expect(main.app.tool.price(1000)).toBe(2)
        })
      })
    
}