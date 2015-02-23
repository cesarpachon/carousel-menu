var CarouselMenu = (function($){
  "use strict";

  //var ITEM_WIDTH = 150+10; //px.. width plus margins

  var _touchable = null;
  var _menu = null;

  var _startx = null;
  var _startleft = 0;

  var _items = null;

  var _selecteditemindex = -1;

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

    var _$lastitem;

    _items = items;

    items.forEach(function(item){

      //visible by default
      if(typeof item.visible === "undefined"){
        item.visible = true;
      }

      var style = "";

      if(!item.visible){
        style = "style='display:none;'";
      }

      _$lastitem = $("<div id='"+item.id+"' class='carousel-menu-entry ' "+style+"><img src='img/"+item.icon+".png'/>"+item.label+"</div>");
      _menu.append(_$lastitem);
    });

    //we are going to use lastitem to transform ems to pixels..
    var item_width = _$lastitem.width()
    + _parse_pix(_$lastitem.css('margin-right'))
    + _parse_pix(_$lastitem.css('margin-left'))
    + _parse_pix(_$lastitem.css('padding-right'))
    + _parse_pix(_$lastitem.css('padding-left'));

    _menu.width((items.length)*item_width);


  };


 /**
  * hide all icons.
  */
  carouselMenu.prototype.hide_icons = function(){
    _menu.find(".carousel-menu-entry").hide();
  };


  /**
  * receive a list of icons ids to make visible. mark the first one as selected.
  * @param icons_list array of strings with the list of icon labels to make visible
  * @param selectedname string with the icon label that must appear as selected
  */
  carouselMenu.prototype.show_icons = function(icons_list, selectedname){

    //first mark all as invisible..
    _items.forEach(function(item){
      item.visible = false;
    });

    _menu.find(".carousel-menu-entry")
      .removeClass("carousel-menu-entry-selected")
      .css("display", "none");


    for(_selecteditemindex = 0; _selecteditemindex < _items.length; ++_selecteditemindex){
      if(_items[_selecteditemindex].id === selectedname){
        _menu.find(".carousel-menu-entry#menu_"+selectedname).addClass("carousel-menu-entry-selected");
        break;
      }
    }

    var self=this;
    icons_list.forEach(function(iconid){
      self.enable_item("menu_"+iconid, true);
      //_menu.find(".carousel-menu-entry#menu_"+iconid).show(100);
    });


  };


  /**
  * hide/show a item
  */
  carouselMenu.prototype.enable_item = function(itemid, flag){
    var item = this.get_item(itemid);
    item.visible = flag;
    _menu.find(".carousel-menu-entry#"+item.id).css("display", item.visible?"inline":"none");
  };


  /**
  * just a getter by id
  */
  carouselMenu.prototype.get_item = function(itemid){
    for(var i=0; i<_items.length; ++i){
      if(_items[i].id === itemid){
        return _items[i];
      }
    }
  };



  /**
  * we use this method to simulate clicking on the items.
  * the carousel will send a command through the listeners module
  */
  carouselMenu.prototype.on_end_drag = function(x){
    if(Math.abs(x - _startx) < 10){

      var leaveindex = -1;

      if(_selecteditemindex > -1){
        leaveindex = _selecteditemindex;
      }

      //who whas clicked?
      var dx = x - _parse_pix(_menu.css("left")) /*+ (_menu.width()/_items.length)>>1*/;
      var slot = Math.min(_items.length-1, Math.floor((dx / _menu.width())*_items.length));

      //how many invisible items there are at the left of the clicked coordinate? increment index..
      for(var i=0; i<slot; ++i){
        if(!_items[i].visible) {
          slot++;
        }
      }
      //now, maybe the current slot is invisible too.. increment until find a visible one (or nothing?)
      while(slot < _items.length && !_items[slot].visible){
        slot++;
      }

      if(slot < _items.length && (slot != leaveindex)){
        _selecteditemindex = slot;
        _menu.find(".carousel-menu-entry").removeClass("carousel-menu-entry-selected");
        _menu.find(".carousel-menu-entry#"+_items[_selecteditemindex].id).addClass("carousel-menu-entry-selected");
        if(leaveindex > -1){
          Listeners._emit("carousel_menu_leave", _items[leaveindex]);
        }
        Listeners._emit("carousel_menu_enter", _items[_selecteditemindex]);
      }

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
