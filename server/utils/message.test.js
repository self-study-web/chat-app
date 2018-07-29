var expect = require("expect");

var { generateMessage, generateLocationMessage } = require("./message");

describe("generateMessage", () => {
  it("should generate the correct message object", () => {
    var res = generateMessage("Ben", "Hello");
    expect(res.from).toEqual("Ben");
    expect(res.text).toEqual("Hello");
    expect(res.createdAt).toBeTruthy();
  });
});

describe("generateLocationMessage", () => {
  it("should generate the correct location object", () => {
    var from = "Ben";
    var lat = 15;
    var lon = 19;
    var expectedUrl = "https://www.google.com/maps?q=15,19";
    var res = generateLocationMessage(from, lat, lon);
    expect(res.from).toEqual("Ben");
    expect(res.url).toEqual(expectedUrl);
    expect(res.createdAt).toBeTruthy();
  });
});
