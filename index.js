const { EventEmitter } = require("events");

class IRReceiver extends EventEmitter {
  constructor(pin, options) {
    super();
    options = options || {};
    this.pin = pin;
    this.timeout = options.timeout || 100000;
    setWatch(
      () => {
        var pulse = pulseRead(pin, 100, {
          timeout: this.timeout,
          startState: LOW,
        });
        var data = 0;
        // at least 32 signal changes required
        if (Array.isArray(pulse) && pulse.length >= 32) {
          pulse[0] += 1000; // add debounce time(us)
          var bits = Math.floor((pulse.length - 2) / 2);
          for (var i = 0; i < bits; i++) {
            if (pulse[i * 2 + 3] > 1000) {
              data += 1 << (bits - 1 - i);
            }
          }
          this.emit("data", data, bits, pulse);
        }
      },
      this.pin,
      FALLING,
      1
    );
  }
}

exports.IRReceiver = IRReceiver;
