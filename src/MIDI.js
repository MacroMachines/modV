class MIDI {
	constructor(modV) {
		/**
		 * Parent ModV instance
		 * @type {ModV}
		 * @private
		 */
		this._modV = modV;

		/** @type {MIDIAccess} */
		this.access = null;

		/** @type {MIDIInputMap} */
		this.inputs = null;

		/**
		 * @todo Add flag description
		 * @type {boolean}
		 */
		this.learning = false;

		/**
		 * @todo Add flag description
		 * @type {EventTarget}
		 */
		this.currentNode = null;

		/** @type {?string} */
		this.currentModuleName = null;

		/** @type {?(string|number)} */
		this.currentControlKey = null;

		/**
		 * @todo Add description and better type annotation
		 * @type {Map}
		 */
		this.assignments = new Map();
	}

	/**
	 * Returns name of MIDI input by given id
	 * @param {DOMString} id
	 * @return {DOMString} According to https://webaudio.github.io/web-midi-api
	 */
	getNameFromID(id) {
		const inputs = this.inputs;
		let name;

		for(let input of inputs.values()) {
			if (id === input.id) {
				name = input.name;
			}
		}

		return name;
	}

	handleDevices() {
			let inputs = this.inputs;

			// loop over all available inputs and listen for any MIDI input
			for (let input of inputs.values()) {

				if(!this.assignments.get(input.id)) this.assignments.set(input.id, {});

				// each time there is a midi message call the onMIDIMessage function
				input.addEventListener('midimessage', this.handleInput.bind(this));
			}
		}

		handleInput(message) {
			const modV = this._modV;

			let data = message.data;
			let midiChannel = parseInt(data[1]);
			let inputMap = this.assignments.get(message.currentTarget.id);
			let Control;
			let isReserved;

			let assignment = inputMap[midiChannel];

			if(this.learning) {
				inputMap[midiChannel] = this.createAssignment(this.currentNode, message.currentTarget.id, midiChannel, this.currentModuleName, this.currentControlKey);

				this.currentControlKey = null;
				this.currentModuleName = null;

				this.currentNode = null;
				this.learning = false;
			}

			if(assignment) {
				let moduleName = assignment.moduleName;
				let controlKey = assignment.controlKey;

				isReserved = controlKey.indexOf('modVReserved:');

				if(isReserved > -1) {
					Control = modV.activeModules[moduleName].info.internalControls[controlKey.substring(MIDI.RESERVED_KEY.length)];
				} else {
					Control = modV.activeModules[moduleName].info.controls[controlKey];
				}

				var midiNode = document.querySelector("*[data-midichannel='" + data[1] + "'][data-midideviceid='" + message.currentTarget.id + "']");

				if(midiNode && Control) {

					modV.isControl(Control, {

						range: () => {
							let calculatedValue = Math.map(parseInt(data[2]), 0, 127, parseFloat(midiNode.min), parseFloat(midiNode.max));

							if(parseInt(Control.node.value) === calculatedValue) return;

							if(isReserved < 0) Control.update(calculatedValue);
							else {
								modV.activeModules[moduleName].info[controlKey.substring(MIDI.RESERVED_KEY.length)] = calculatedValue;
								Control.node.value = calculatedValue;
							}
						},

						checkbox: () => {
							if(parseInt(data[2]) > 63) {
								if(isReserved < 0) Control.update(!Control.node.checked);
								else {
									Control.node.checked = !Control.node.checked;

									modV.activeModules[moduleName].info[controlKey.substring(MIDI.RESERVED_KEY.length)] = !Control.node.checked;
								}
							}
						},

						select: () => {
							let node = Control.node;
							let calculatedIndex = Math.floor(Math.map(parseInt(data[2]), 0, 127, 0, node.length-1));

							if(parseInt(Control.node.selectedIndex) === calculatedIndex) return;

							if(isReserved < 0) Control.update(calculatedIndex);
							else {
								Control.node.selectedIndex = calculatedIndex;
								let selectValue = Control.node.options[calculatedIndex].value;

								modV.activeModules[moduleName].info[controlKey.substring(MIDI.RESERVED_KEY.length)] = selectValue;
							}
						},

						button: () => {
							if(parseInt(data[2]) > 63) {
								Control.push();
							} else {
								Control.release();
							}
						}
					});
				}
			}

			modV.emit('midiInput', this);
		}

		importAssignments(assignments) {
			const modV = this._modV;

			assignments.forEach((channels, deviceID)  => {

				if(!this.assignments.get(deviceID)) this.assignments.set(deviceID, {});
				let inputMap = this.assignments.get(deviceID);

				forIn(channels, (channel, assignment) => {
					let moduleName = assignment.moduleName;
					let controlKey = assignment.controlKey;

					let isReserved = controlKey.indexOf('modVReserved:');
					let Control;

					if(isReserved > -1) {
						Control = modV.activeModules[moduleName].info.internalControls[controlKey.substring(MIDI.RESERVED_KEY.length)];
					} else {
						Control = modV.activeModules[moduleName].info.controls[controlKey];
					}

					let inputNode = Control.node;

					inputMap[channel] = this.createAssignment(inputNode, deviceID, channel, moduleName, controlKey);
				});

			});
		}

		createAssignment(node, id, channel, name, controlKey) {
			let inputNode = node;

			inputNode.dataset.midichannel = channel;
			inputNode.dataset.midideviceid = id;

			return {
				controlKey: controlKey,
				moduleName: name
			};
		}

		start() {

			// request MIDI access
			if (navigator.requestMIDIAccess) {
				navigator.requestMIDIAccess({
					sysex: false
				}).then((access) => {

					this.access = access;
					this.inputs = access.inputs;

					this.handleDevices();

					access.addEventListener('statechange', () => {
						this.handleDevices();
					});

				}, (error) => {
					console.error('MIDI access was refused. Please check your MIDI permissions', error);
				});
			} else {
				console.error('No MIDI support in your browser.');
			}

		}
}

/**
 * Control key prefix used to highlight internal controls
 * @todo Clarify description
 * @const {string}
 */
MIDI.RESERVED_KEY = 'modVReserved:';

module.exports = MIDI;
