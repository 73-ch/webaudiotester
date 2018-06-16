export default class {
    constructor() {
        performance.mark('constructor_start');
        console.log('hello');

        this.context = new AudioContext();
        this.current_time = 0;

        this.gain_node = this.context.createGain();
        this.gain_node.gain.value = 0.9;

        this.gain_node.connect(this.context.destination);

        this.play_osc = false;

        this.initOsc();
        performance.mark('constructor_end');
        performance.measure("constructor", "constructor_start", "constructor_end");

        console.log(performance.getEntries());
    }

    triggerOsc(_flag) {
        this.play_osc = true;
        if (_flag == "start") {
            this.initOsc();
            this.osc.start();
        } else if (_flag == "stop") {
            this.osc.stop();
        }
    }

    changeGain(_gain) {
        this.gain_node.gain.value = _gain;
    }

    initOsc() {
        performance.mark('create_osc_start');
        this.osc = this.context.createOscillator();
        this.osc.connect(this.gain_node);
        this.changeOscFreq(440);
        this.changeOscType("sine");
        performance.mark('create_osc_end');
        performance.measure('create_osc', 'create_osc_start', 'create_osc_end');
    }

    changeOscFreq(_freq) {
        this.osc.frequency.value = _freq;
    }

    changeOscType(_type) {
        this.osc.type = _type;
    }
}

