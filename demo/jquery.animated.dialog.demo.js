;(function($) {
   
   $(document).ready(function() {
      
      var expands = ["centerExpand", "topExpand", "bottomExpand", "leftExpand", "rightExpand"];
      for (var x = 0; x < expands.length; x++) {
         $("#animated-dialog-demo-" + (x + 1)).animatedDialog({
            "tween": expands[x],
            "background": {
               "start": "#1565C0",
               "end": "#fff"
            }
         });
      }
   });
   
})(jQuery);