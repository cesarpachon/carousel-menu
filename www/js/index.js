


$(document).bind("mobileinit", function(ev) {

  console.log("mobile init!");

  var carouselMenu = new CarouselMenu([
    {id: "item1", label: "item 1"},
    {id: "item2", label: "item 2"},
    {id: "item3", label: "item 3"},
    {id: "item4", label: "item 4"},
    {id: "item5", label: "item 5"},
    {id: "item6", label: "item 6"}
  ]);


  var listener = {};

  listener.on_cmd_carousel_menu_enter = function(menuitem){
    $("section#"+menuitem.id).show(200);
  };

  listener.on_cmd_carousel_menu_leave = function(menuitem){
    $("section#"+menuitem.id).hide(200);
  };


  Listeners._register(listener);


});


