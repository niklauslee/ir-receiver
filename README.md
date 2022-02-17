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

# Example

This example shows how to transmit IR signals read from a remote controller.

## Components

| Part              | Quantity  | Note | 
| ----------------- | --------- | ---- |
| Raspberry Pi Pico | 1         |      |
| Breadboard        | 1         | mini |
| Push button       | 1         |      |
| IR LED            | 1         | 940nm  |
| IR receiver       | 1         | TSOP38438 (or TSOP1838) 38KHz |
| Remote controller | 1         | NEC type (38KHz) |
| Jumper wires      |           |      |

## Wiring

| Raspberry Pi Pico | IR receiver | IR LED  | Button |
| ----------------- | ----------- | ------- | ------ |
| 3V3               | VCC         |         | L1     |
| GND               | GND         |         |        |
| GP15              | OUT         |         |        |
| GP16              |             | anode   |        |
| GP17              |             | cathode |        |
| GP14              |             |         | L2     |

![example](https://github.com/niklauslee/ir-receiver/blob/main/images/example.jpg?raw=true)

## Code

When you send IR signal to the IR receiver using a remote controller (38KHz), the signal pulse is stored in the `memory` variable. Then, it sends the stored IR signal whenever you press the button.

```js
const {IRReceiver} = require('ir-receiver');

var memory = null;  // to store received IR signal
var recv = 15;      // pin for IR receiver
var led_pulse = 16; // pin for IR LED digital pulse
var led_pwm = 17;   // pin for IR LED 38KHz carrier
var btn = 14;       // pin for button

pinMode(recv, INPUT_PULLUP);
pinMode(led_pulse, OUTPUT);
pinMode(btn, INPUT_PULLDOWN);

// receive IR signal and save to memory
var ir = new IRReceiver(recv);
ir.on('data', (data, bits, pulse) => {
  console.log('IR signal received.');
  console.log(`- data: ${data.toString(16)} (${bits} bits)`);
  console.log(`- pulse(${pulse.length}): [${pulse.join(',')}]`);
  memory = pulse;
});

// send IR signal stored in memory
function send() {
  analogWrite(led_pwm, 0.5, 38000); // 38KHz
  pulseWrite(led_pulse, HIGH, memory);
  digitalWrite(led_pulse, LOW);
  console.log('Sent IR signal.');
}

// send signal when button pressed
setWatch(send, btn, RISING, 10);
```

## References

- https://learn.adafruit.com/using-an-infrared-library/sending-ir-codes
- https://www.raspberry-pi-geek.com/Archive/2015/10/Raspberry-Pi-IR-remote


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
