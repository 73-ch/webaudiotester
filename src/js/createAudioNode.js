export default class {
    constructor(context, json) {
        this.context = context;

        this.json = json;

        this.buffers = {};

        this.nodes = {};


        // jsonが正しく作られているかをチェック
        this.json_tugs = ["name", "node_type", "out"]; // audio_nodesに対してチェックする要素

        if (this.json.hasOwnProperty("load_files")) {
            this.jsonCheck().then(() => {
                for (let file of this.json.load_files) {
                    if (file.hasOwnProperty("path")) {
                        this.loadFile(file.path).then((response) => {
                            let loadings = [];
                            loadings.push(this.context.decodeAudioData(response).then((buffer) => {
                                this.buffers[file.buffer_name] = buffer;
                            }, () => {
                                console.error("decode error")
                            }));
                            Promise.all(loadings).then(() => {
                                for (let an of this.json.audio_nodes) {
                                    if (an.node_type == "buffer_source") this.createBufferSources(an);
                                }
                            });
                        });
                    }
                }
            });
        }

        for (let an of this.json.audio_nodes) {
            switch (an.node_type) {
                case "oscillator":
                    this.createOscillator(an);
                    break;
            }
        }
    }

    // jsonのデータチェック用関数
    jsonCheck() {
        return new Promise((resolve, reject) => {
            if (!this.json.hasOwnProperty("audio_nodes")) console.error('json does not have audio_nodes.');
            for (let n of this.json.audio_nodes) {
                for (let i = 0; i < this.json_tugs.length; i++) {
                    if(!n.hasOwnProperty(this.json_tugs[i])) console.error('json does not have ' + this.json_tugs[i].toString());
                }
            }
            resolve();
        });
    }

    loadFile(path) {
        return fetch(path).then((response) => {
            return response.arrayBuffer();
        });
    }

    createOscillator (audio_node) {
        console.log('read');
        let osc = this.context.createOscillator();
        this.setParams(osc, audio_node.params);
        this.nodes[audio_node.name] = osc;
    }

    createBufferSources (audio_node) {
        let buffer_source = this.context.createBufferSource();
        this.setParams(buffer_source, audio_node.params);
        buffer_source.buffer = this.buffers[audio_node.params.buffer];
        this.nodes[audio_node.name] = buffer_source;
    }

    setParams(target, params) {
        console.log(params);
        for (let p in params) {
            try {
                target[p] = params[p];
            } catch (e) {
                if (p == "buffer") continue;
                target[p].value = params[p];
            }
        }
    }

    getNodes () {
        return this.nodes;
    }
}