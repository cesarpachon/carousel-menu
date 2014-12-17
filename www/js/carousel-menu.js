var CarouselMenu = (function($){

  var ITEM_WIDTH = 150+10; //px.. width plus margins

  var _touchable = null;
  var _menu = null;

  var _startx = null;
  var _startleft = 0;

  var _items = null;

  /**
  * @param items: an array of objects with the labels for the menu
  */
  var carouselMenu = function(items){

    var self = this;

    var _tracking = false;

    _touchable = $(".carousel-menu-touchable");

    //this part binds events for desktop
    _touchable.on("mousedown", function(ev){
      ev.preventDefault();
      self.on_start_drag(ev.pageX);
      _tracking = true;
    });

    _touchable.on("mouseup", function(ev){
      ev.preventDefault();
      if(_tracking){
        self.on_end_drag(ev.pageX);
      }
      _tracking = false;

    });

  _touchable.on("mouseout", function(ev){
      _tracking = false;
    });


    _touchable.on("mousemove", function(ev){
      ev.preventDefault();
      if(_tracking){
        self.on_drag(ev.pageX, ev.pageY);
      }
    });

    _touchable.bind('touchstart', function(ev){
      ev.preventDefault();
      var touch = ev.originalEvent.touches[0] || ev.originalEvent.changedTouches[0];
      self.on_start_drag(touch.pageX);
    });

    _touchable.bind('touchend', function(ev){
      ev.preventDefault();
      var touch = ev.originalEvent.touches[0] || ev.originalEvent.changedTouches[0];
      self.on_end_drag(touch.pageX);
    });


    //this part binds events for mobile
    //trying this: http://www.devinrolsen.com/basic-jquery-touchmove-event-setup/
    _touchable.bind('touchmove',function(e){
      e.preventDefault();
      var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
      var elm = _touchable.offset();
      var x = touch.pageX - elm.left;
      var y = touch.pageY - elm.top;
      if(x < $(this).width() && x > 0){
          if(y < $(this).height() && y > 0){
                  //CODE GOES HERE
                  self.on_drag(touch.pageX, touch.pageY);
          }
      }
    });


    //now we are going to build the menucontainer. the width must be enough to allocate all the items
    _menu = $(".carousel-menu");
    _menu.empty();
    _menu.width(items.length*ITEM_WIDTH);

    _items = items;

    items.forEach(function(item){
      var item = "<div id='"+item.id+"' class='carousel-menu-entry'>"+item.label+"</div>";
      _menu.append(item);
    });

  };

  /**
  * we use this method to simulate clicking on the items. 
  * the carousel will send a command through the listeners module
  */
  carouselMenu.prototype.on_end_drag = function(x){
    if(Math.abs(x - _startx) < 10){
      //who whas clicked?
      var dx = x - _parse_pix(_menu.css("left"));
      var index = Math.floor((dx / _menu.width())*_items.length);

      _menu.find(".carousel-menu-entry").removeClass("carousel-menu-entry-selected");
      _menu.find(".carousel-menu-entry#"+_items[index].id).addClass("carousel-menu-entry-selected");
      
      Listeners._emit("carousel_menu", _items[index].id);

    }
  };

  /**
  *
  */
  carouselMenu.prototype.on_start_drag = function(x){
    _startx =    x;
    _startleft = _menu.css("left");
    _startleft = _parse_pix(_startleft);
  };


  /**
  */
  carouselMenu.prototype.on_drag = function(x, y){
    var dx = (x - _startx) + _startleft;
    if(dx > 0){
      dx = 0;
    }
    if(dx < _touchable.width() - _menu.width()){
      dx = _touchable.width() - _menu.width();
    }
     _menu.css("left", dx);
  };

  /**
  * string with px suffix
  * returns the int value for px
  */
  function _parse_pix(strpx){
    if(typeof(strpx) === "string"){
      return parseFloat(strpx.replace("px",""));
    }else{
      return strpx; //a number?
    }
  }

  return carouselMenu;

})($);
