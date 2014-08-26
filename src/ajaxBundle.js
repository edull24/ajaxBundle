(function(factory) {

	'use strict';

	if (typeof define === 'function' && define.amd) {

		// AMD. Register as an anonymous module.
		define(['jquery'], factory);

	} else {

		// Browser globals
		factory(jQuery);

	}

}(function($) {

	'use strict';

	var defaults = {
		requests: [],
		done: [],
		fail: [],
		always: []
	};

	var slice = Array.prototype.slice;

	var isMultiRequest = function() {

		return this.options.requests.length > 1;

	};

	var getCallbacks = function(type) {

		var userCallbacks = this.options[type];

		if (isMultiRequest.call(this)) {

			// No argument normalization needed, allow jQuery to execute
			// the user callbacks normally.
			return userCallbacks;

		} else {

			// We need to normalize the arguments. After normalization, we
			// will manually execute the user callbacks.
			return function() {

				// Since we don't normalize for fail callbacks, because
				// jQuery always returns the same thing regardless of the
				// number of requests, we need to make sure we don't normalize
				// the arguments for an always callback that is executed after
				// an error occurs.
				var isError = arguments[1] === 'error';
				var args = slice.call(arguments, 0);

				if (!isError) {

					// Convert arguments into an array.
					// Wrap the original arguments in an array to simulate the response
					// from a multi request scenario.
					args = [args];

				}

				// Execute the user defined callbacks with the normailized arguments.
				$.each(userCallbacks, function(i, callback) {

					callback.apply(this, args);

				}.bind(this));

			};

		}

	};

	var bundle = function() {

		// Execute each ajax request and save the returned deferred.
		$.each(this.options.requests, function(i, request) {

			this.deferreds.push(request());

		}.bind(this));

		// Pass all the ajax dererreds into $.when(), which will create a
		// single master promise. Attach our own internal calbacks to the
		// master promise in order to normailize the response arguments.
		this.master = $.when.apply(null, this.deferreds);

		this.master
			.done(getCallbacks.call(this, 'done'))
			// No normalization needed for fail callbacks.
			.fail(this.options.fail)
			.always(getCallbacks.call(this, 'always'));

		return this;

	};

	var ajaxBundle = function(options) {

		var bundler = {};

		// Array to hold all the dererreds returned by each ajax request.
		bundler.deferreds = [];

		// The master promise returned from the $.when() call.
		bundler.master = {};

		// Merge in the ajax requests and callbacks.
		bundler.options = $.extend(true, {}, defaults, options);

		// Return the instance.
		return bundle.call(bundler);

	};

	// Add this utility to the jQuery namespace.
	$.extend({
		ajaxBundle: ajaxBundle
	});

}));