


$(document).bind("mobileinit", function(ev) {

  console.log("mobile init!");

  var carouselMenu = new CarouselMenu([
    {id: "item1", label: "item 1", icon: "icon0"},
    {id: "item2", label: "item 2", icon: "icon1"},
    {id: "item3", label: "item 3", icon: "icon2"},
    {id: "item4", label: "item 4", icon: "icon3"},
    {id: "item5", label: "item 5", icon: "icon4"},
    {id: "item6", label: "item 6", icon: "icon5"}
  ]);


  var listener = {};

  listener.on_cmd_carousel_menu_enter = function(menuitem){
    $("section#"+menuitem.id).show(200);
  };

  listener.on_cmd_carousel_menu_leave = function(menuitem){
    $("section#"+menuitem.id).hide(200);
  };


  Listeners._register(listener);

  $("input").on("change", function(ev){

    carouselMenu.enable_item(ev.target.id ,$(ev.target).prop("checked"));

  });


});


