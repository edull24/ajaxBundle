ajaxBundle
==========

This jQuery plugin creates an easy way to bundle ajax requests, enabling you to run callbacks when **ALL** of the requests have finished.

This is a simple abstraction over manually using `$.when()` to create a master promise to attach callbacks to. It has the added benefit of also normalizing the response format that varies between single and multiple requests sent to `$.when()`.

## Overview

The `$.ajaxBundle()` method accepts a single options object. The following options are supported:

Option | Description
------ | -----------
requests | array of functions that return the [jqXHR](http://api.jquery.com/jQuery.ajax/#jqXHR) object returned from the `$.ajax()` request (or an object that implements the Promise interface)
done | array of functions that will be called on successful completion of **ALL** requests
fail | array of functions that will be called on failure of **ANY** request
always | array of functions that will be called, regardless of outcome

The callbacks are executed based on the order in their respective array.

Each callback will be passed `n` arguments, where `n` is the number of ajax requests (except in the event of a failure, see below). These arguments will be ordered in the same order their respective ajax requests were initiated. Each argument is an array with the following structure: `[data, statusText, jqXHR]`. A gotcha with `$.when()` is when you pass in a single Deferred, in which case it will not wrap the response in an array like it does with multiple Deferreds. This is confusing and error prone. This plugin normalizes the response, so even in the case of a single Deferred/request, the response will be wrapped in an array.

The master promise used to track all of the requests is available as an instance property: `myBundle.master`.

All of the jqXHR/Deferred objects returned from the requests are also available as an instance property: `myBundle.deferreds`. This enables you to keep references to the underlying jqXHR/Deferred objects so you can inspect/cancel them in a fail callback in the event of a failed request.

Also note that in the case of failure, regardless of how many ajax requests were inititated, the response will not be wrapped in an array. jQuery is consistent in its responses in this scenario, so no normalization is necessary.

## Usage

Create and save a reference to a new bundle:

    var myBundle = $.ajaxBundle({
      requests: myRequests,
      done: myDoneCallbacks
    });
    
The requests will automatically be run and your callbacks executed upon completion.

For example, if myRequests is an array with one request and myDoneCallbacks is an array with a single callback like so:

    function() {
     
      console.log(arguments);
      
    }
    
Upon successful completion of the request, the following would be logged:

    [Array[3]]
    
With the contents looking something like:

    0: Array[3]
      0: "the response text" // data returned from server
      1: "success" // status text
      2: Object // jqXHR object

## Support

* jQuery 1.5+
* Global Scope jQuery
* AMD
