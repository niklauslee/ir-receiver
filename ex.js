const pin = 15;
pinMode(pin, INPUT_PULLUP);

const { IRReceiver } = require("./index");
const ir = new IRReceiver(15);

ir.on("data", (data, bits) => {
  console.log(`data: ${data.toString(16)} (${bits} bits)`);
});
