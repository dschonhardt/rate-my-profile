// Supports getting innerText, or if an <img> tag, will get src

module.exports = function(config) {
	var processElement = function (element) {
		if (element)
			return element.tagName === 'IMG' ? element.src : element.innerText;
		return null;
	};

	var processString = function (string) {
		var elements = document.querySelectorAll(string);
		if (elements.length > 1) {
			var result = [];
			for (var i = 0; i < elements.length; i++) {
				result.push(processElement(elements[i]));
			}
			return result;
		}
		else
			return processElement(elements[0]);
	};

	var processArray = function(arr) {
		return arr.map(process);
	};

	var process = function (value) {
		if (Array.isArray(value)) {
			return processArray(value);
		}
		else if (value && typeof value === 'object') {
			return processGroup(value);
		}
		else if (value) {
			return processString(value);
		}
		return null;
	};

	var processGroup = function(data) {
		var result = {};
		Object.keys(data).forEach(function (key) {
			var value = data[key];
			result[key] = process(value);
		});
		return result;
	};

	return processGroup(config);
}