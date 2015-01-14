


$(document).bind("mobileinit", function(ev) {

  console.log("mobile init!");

  var carouselMenu = new CarouselMenu([
    {id: "item1", label: "item1"},
    {id: "item2", label: "item2"},
    {id: "item3", label: "item3"},
    {id: "item4", label: "item4"},
    {id: "item5", label: "item5"},
    {id: "item6", label: "item6"}
  ]);


  var listener = {};

  listener.on_cmd_carousel_menu = function(ev){console.log(ev);}


  Listeners._register(listener);


});


