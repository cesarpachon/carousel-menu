var CarouselMenu = (function($){

  var carouselMenu = function(){

    var self = this;

    $(".carousel-menu-entry").on("vmousedown", function(ev){
      console.log("vmousedown");
    });

    $(".carousel-menu-entry").on("vmouseup", function(ev){
      console.log("vmouseup");
    });

    $(".carousel-menu-entry").on("mousemove", function(ev){
      console.log("move");
    });
  };


  return carouselMenu;

})($);
