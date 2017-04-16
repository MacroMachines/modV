/**
 * The base Control Class
 */
class Control {

	/**
	 * @param  {ControlSettings} settings
	 * @param  {Function}        setValue Custom function to override the default way of parsing values before commiting changes to target variable
	 */
	constructor(settings, setValue) {
		if(!('variable' in settings)) throw new Error('Control had no "variable" in settings');
		// if(!('label' in settings) && !settings.useInternalValue) {
		// 	throw new Error('Control had no "label" in settings');
		// }

		this.node = null;

		let id, value, Module, modV;

		if(!setValue) {
			setValue = function(valueIn) {
				if(settings.varType === 'int') value = parseInt(valueIn);
				else if(settings.varType === 'float') value = parseFloat(valueIn);
				else value = valueIn;

				if('prepend' in settings) value = settings.prepend + value;
				if('append' in settings) value += settings.append;

				return value;
			};
		}

		Object.defineProperty(this, '_modVSet', {
			set: (modVIn) => {
				modV = modVIn;
				delete this._modVSet;
				Object.defineProperty(this, 'modV', {
					get: () => {
						return modV;
					}
				});
			},
			configurable: true
		});

		Object.defineProperty(this, '_ModuleSet', {
			set: (ModuleIn) => {
				Module = ModuleIn;
				delete this._ModuleSet;
			},
			configurable: true
		});

		Object.defineProperty(this, 'Module', {
			get: () => {
				return Module;
			}
		});

		Object.defineProperty(this, '_idSet', {
			set: (idIn) => {
				id = idIn;
				delete this._idSet;
			},
			configurable: true
		});

		Object.defineProperty(this, 'id', {
			get: () => {
				return id;
			}
		});

		Object.defineProperty(this, 'settings', {
			get: () => {
				return settings;
			}
		});

		Object.defineProperty(this, 'value', {
			get: () => {
				return value;
			},
			set: (valueIn) => {
				let variable = settings.variable;

				value = setValue(valueIn);

				if(!settings.useInternalValue) {
					Module[variable] = value;
				} else settings.oninput(value);

				if(modV) modV.emit('controlUpdate', this);
			}
		});
	}

	init(id, Module, node, isPreset, internalPresetValue, modV) {
		let settings = this.settings;

		this.node = node;
		this._idSet = id;
		this._modVSet = modV;
		this._ModuleSet = Module;
		node.id = id;

		// Control being used internally, return
		if(settings.useInternalValue) {
			if(isPreset) node.value = internalPresetValue;
			else if('default' in settings) node.value = settings.default;

			return;
		}

		let nodeValue;

		if('default' in settings) {
			if(!isPreset) this.value = settings.default;
			nodeValue = settings.default;

		} else if(Module[this.variable] !== undefined) {
			nodeValue = Module[this.variable];
		}

		if(isPreset) {
			nodeValue = Module[this.variable];
		}

		if('append' in settings && typeof nodeValue === 'string') {
			node.value = nodeValue.replace(settings.append, '');
		}

		if('prepend' in settings && typeof nodeValue === 'string') {
			node.value = nodeValue.replace(settings.prepend, '');
		}
		node.value = nodeValue;
	}

	get label() {
		return this.settings.label;
	}

	get variable() {
		return this.settings.variable;
	}

	get varType() {
		return this.settings.varType;
	}

	update(value) {
		this.value = value;
		// TODO: add updateNodeValue method to all control types
		if(this instanceof this.modV.CheckboxControl) {
			this.node.checked = this.checked;
		} else {
			this.node.value = this.value;
		}
	}
}

module.exports = Control;