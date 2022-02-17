# IR-receiver

Kaluma library for IR (Infrared) receiver.

# Wiring

Here is a wiring example for IR receiver. In this example we used TSOP1838 or TSOP38438 (38KHz).

| Raspberry Pi Pico | IR receiver |
| ----------------- | ----------- |
| 3V3               | VCC         |
| GND               | GND         |
| GP15              | OUT         |

![wiring](https://github.com/niklauslee/ir-receiver/blob/main/images/wiring.jpg?raw=true)

# Install

```sh
npm install https://github.com/niklauslee/ir-receiver
```

# Usage

Here is an example code.

```js
const {IRReceiver} = require('ir-receiver');
const pin = 15;
pinMode(pin, INPUT_PULLUP);
const ir = new IRReceiver(15);
ir.on('data', (data, bits) => {
  console.log(`data: ${data.toString(16)} (${bits} bits)`);
});
```

# API

## Class: IRReceiver

### IRReceiver(pin[, options])

- **`pin`** `<number>`
- **`options`** `<object>`
  - **`timeout`** `<number>` Enough time to receive data in microseconds. Default: `100000`.

Create an instance and ready to receive IR signals.

### Event: 'data'

- **`data`** `<number>` The received data.
- **`bits`** `<number>` The size of data. (Many remote controller sends 32-bits data).
- **`pulse`** `<number[]>` The raw pulse data.

Emitted when data is received.
