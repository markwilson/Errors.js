/**
 * Handle JavaScript errors easily
 * Author: Mark Wilson (@mark_wilson)
 */

/**
 * Error handling class
 * This should be the first JS script on the page
 */
var Errors = {
	errorQueue: [],
	debug: false,
	ajax: false,
	custom: false,
	ajaxErrorHandling: function () { throw new Error('No Ajax error handler defined'); },
	customErrorHandling: function () { throw new Error('No custom error handler defined'); },
	options: {},
	
	
	
	/**
	 * Basic error handling - this will be called immediately when including this class
	 */
	initialErrorHandling: function (errorMessage, url, lineNumber) {
		// add error to queue of errors ready to be handled
		Errors.errorQueue.push({
			message: errorMessage,
			url: url,
			lineNumber: lineNumber
		});
	},
	
	/**
	 * Main error handler function - used after Errors.initialise(...)
	 */
	jsErrorHandling: function (errorMessage, url, lineNumber) {
		var data = {
			message: errorMessage,
			url: url,
			lineNumber: lineNumber,
			userAgent: navigator.userAgent
		};
		
		if (Errors.debug) {
			Errors.debugErrorHandling.call(Errors, data);
		}
		
		if (Errors.ajax) {
			Errors.ajaxErrorHandling.call(Errors, data);
		}
		
		if (Errors.custom) {
			Errors.customErrorHandling.call(Errors, data);
		}
	},
	
	/**
	 * Basic alert error handling for debug mode
	 */
	debugErrorHandling: function (data) {
		alert(data.message + ' ' + data.url + ' ' + data.lineNumber);
	},
	
	/**
	 * Build request data as string
	 */
	buildRequestData: function (parameters) {
		var data = '';
		
		for (var index in parameters) {
			data += escape(index) + '=' + escape(parameters[index]) + '&';
		}
		
		return data.replace(/&$/, '');
	},
	
	/**
	 * Call after loading frameworks
	 */
	initialise: function (options) {
		// parse options
		if (typeof options.ajax === 'object') {
			if (options.ajax.url && options.ajax.method) {
				// set up ajax options
				Errors.options.ajax = options.ajax;
				Errors.ajax = true;
			} else {
				throw new Error('Ajax options were not fully defined. Requires url, and method');
			}
		}
		
		if (typeof options.customHandler === 'function') {
			Errors.custom = true;
			Errors.customErrorHandling = options.customHandler;
		}
		
		Errors.debug = (options.debugMode === true);
		
		if (!Errors.ajax && !Errors.debug && !Errors.custom) {
			// no error handler defined in options
			throw new Error('No error handling is defined. At least use debugMode');
		}
		
		if (Errors.ajax) {
			var ajaxErrorHandler;
			
			ajaxErrorHandler = function (data) {
				var url = Errors.options.ajax.url;
				var dataString = Errors.buildRequestData(data);
				
				if (Errors.options.ajax.method === 'GET') {
					url += '?' + dataString;
				}
				
				var xmlhttp;
				if (window.XMLHttpRequest) {
					xmlhttp = new XMLHttpRequest();
				} else {
					xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
				}
				
				xmlhttp.open(Errors.options.ajax.method, Errors.options.ajax.url, true);
				
				if (Errors.options.ajax.method === 'GET') {
					xmlhttp.send();
				} else {
					xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
					xmlhttp.send(dataString);
				}
			};
			
			Errors.ajaxErrorHandling = ajaxErrorHandler;
		}
		
		// set the proper error handler
		window.onerror = Errors.jsErrorHandling;
		
		// check the queue for existing errors
		while (Errors.errorQueue.length) {
			var error = Errors.errorQueue.shift();
			errorHandler.call(Errors, error.message, error.url, error.lineNumber);
		}
	}
};

// set up basic error handling
window.onerror = Errors.initialErrorHandling;