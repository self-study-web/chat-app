var expect = require("expect");

var { generateMessage } = require("./message");

describe("generateMessage", () => {
  it("should generate the correct message object", () => {
    var res = generateMessage("Ben", "Hello");
    expect(res.from).toEqual("Ben");
    expect(res.text).toEqual("Hello");
    expect(res.createdAt).toBeTruthy();
  });
});
