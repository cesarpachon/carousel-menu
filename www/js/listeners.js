var Listeners = (function(){
  'use strict';

 //module object
 var listeners = {};

  /**
   * keep a reference to command listeners
   * @see ._register and ._emit
   * @type {Array}
   * @private
   */
  var _listeners = [];


  /**
   * a listener is a object capable of receive commands sent through ._emit.
   *  must implement a on_cmd_xxx for each command they want to listen to.
   *  return true from a listener method means the command had been consumed and won't be processed for other listeners.
   * @param listener {object}
   */
  listeners._register = function(listener){
    if(!listener) return;
    //be sure the object is registered only once
    var registered = false;
    _listeners.forEach(function(r){
      if(r === listener){
        registered = true;
      }
    });
    if(!registered){
      _listeners.push(listener);
    }
  };

  /**
   * emit a command to the collection of listeners.
   * @param cmd {string} name of the command
   * you can pass any number of parameters. they are going to be passed down without the fist one (command name)
   * @private
   */
  listeners._emit = function(cmd){

    [].shift.apply(arguments);
    var _arguments = arguments;
    _listeners.forEach(function(r){
      var cb = r["on_cmd_"+cmd];
      if(cb){
        cb.apply(r, _arguments);
      }
    });
  };

  return listeners;

})();
