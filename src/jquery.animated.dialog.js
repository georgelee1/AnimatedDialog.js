;(function($) {
	
	// Detect mobile device. jQuery.browser.mobile (http://detectmobilebrowser.com/
    (function(a){(jQuery.browser=jQuery.browser||{}).mobile=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4));})(navigator.userAgent||navigator.vendor||window.opera);

	/**
	 * Micro jQuery plugin, that converts elements in a data set to a nested mapped object with the ability to filter by a prefix.
	 * Example, for element that has data attributes "data-test-key=val, data-test2-key2=val2"
	 * $(ele).data() will return {"testKey":"val", "test2Key2":"val2"}
	 * $(ele).dataMap() will return {"test": {"key":"val"}, "test2":{"key2":"val2"}}
	 * $(ele).dataMap("test") will return {"key":"val"}
	 */
	$.fn.dataMap = function(prefixFilter) {
		var options = {};
		this.each(function() {
			var data = $(this).data();
			for (var key in data) {
				if (key) {
					var parts = key.replace(/([A-Z])/g, '-$1').split("-"), map = options;

					if (!prefixFilter || parts.shift() === prefixFilter) {
						parts.forEach(function(ele, index) {
							if (index + 1 < parts.length) {
								ele = ele.toLowerCase();
								map = options[ele] = options[ele] || {};
							}
						});
						map[parts.pop().toLowerCase()] = data[key];
					}
				}
			}
		});
		return options;
	}
	
	/**
	 * Polyfill. The forEach() method executes a provided function once per
	 * array element.
	 */
	if (!Array.prototype.forEach) {
		Array.prototype.forEach = function(callback, thisArg) {
			if (typeof callback !== "function") {
				throw new TypeError(callback + ' is not a function');
			}
			var x = 0, len = this.length, next;
			for (; x < len; x++) {
				callback.call(thisArg, this[x], x, this);
			}
		}
	}

	// Detect transitionEnd action
	var transitionEnd = (function() {
		if (!$.browser.mobile) {
			var el = document.createElement("div"), transitions = {
				"transition" : "transitionend",
				"MozTransition" : "transitionend",
				"OTransition" : "oTransitionEnd",
				"WebkitTransition" : "webkitTransitionEnd",
				"msTransition" : "MSTransitionEnd"
			};
			for ( var x in transitions) {
				if (x in el.style) {
					return transitions[x];
				}
			}
		}
		return false;
	})();
	
	$.fn.onTransitionEnd = function(callback) {
		this.one(transitionEnd, function() {
			setTimeout(callback, 16);
		});
	};

	var SimpleTween = function(ele, complete) {
		this.ele = ele;
		this.complete = complete;
		this.queue = [];
		this.applied = [];
		this.current = {
			"left" : this.ele.css("left"),
			"top" : this.ele.css("top"),
			"maxWidth" : this.ele.css("maxWidth"),
			"maxHeight" : this.ele.css("maxHeight"),
			"backgroundColor" : this.ele.css("backgroundColor")
		};
	}

	SimpleTween.prototype.add = function(css) {
		this.queue.push(css);
	};
	
	SimpleTween.prototype.apply = function(css) {
		var diff = {}, current = this.current;
		["left", "top", "maxWidth", "maxHeight"].forEach(function(prop) {
			if (css[prop] && parseInt(css[prop]) != parseInt(current[prop])) {
				diff[prop] = current[prop];
			}
		});
		["backgroundColor"].forEach(function(prop) {
			if (css[prop] && css[prop] != current[prop]) {
				diff[prop] = current[prop];
			}
		});
		this.applied.push(diff);
		this.current = $.extend({}, this.current, css);
	}

	SimpleTween.prototype.next = function() {
		var css = this.queue.shift();
		if (css) {
			if (transitionEnd) {
				this.ele.onTransitionEnd($.proxy(this.next, this));
			}
			this.apply(css);
			this.ele.css(css);
			if (!transitionEnd) {
				this.next();
			}
		} else if (typeof this.complete === "function") {
			this.complete.apply(this.ele.get(0));
		}
	};
	
	SimpleTween.prototype.reverse = function() {
		var css = this.applied.pop();
		if (css) {
			if (transitionEnd) {
				this.ele.onTransitionEnd($.proxy(this.reverse, this));
			}
			this.ele.css(css);
			if (!transitionEnd) {
				this.reverse();
			}
		} else if (typeof this.complete === "function") {
			this.complete.apply(this.ele.get(0));
		}
	}

	var AnimatedDialog = function(ele, options) {
		this.ele = ele;
		this.options = $.extend(options, ele.dataMap("ad"));
		this.showing = false;
		this.reset = {};
		this.root = $("body");

		this.build();
		this.ele.on("click", $.proxy(this.toggle, this));
	};

	AnimatedDialog.prototype.build = function() {
		this.wrap = $("<div></div>").addClass("animated-dialog-wrap");
		this.dialog = $("<div></div>").addClass("animated-dialog").appendTo(this.wrap);

		this.content = (this.options.content.indexOf("#") === 0 ? this.root: this.ele).find(this.options.content);
		this.content.addClass("animated-dialog-content hide").appendTo(this.dialog);
		this.content.on("click", this.options.closeable, $.proxy(this.toggle, this));

		this.root.append(this.wrap);
	};
	
	AnimatedDialog.prototype.tweens = {
		"centerExpand" : function(container, start, end) {
			return [{
				"left" : (container.width / 2) - (start.width / 2),
				"top" : (container.height / 2) - (start.height / 2)
			}, end];
		},
		"topExpand" : function(container, start, end) {
         return [{
            "left" : (container.width / 2) - (start.width / 2),
            "top" : (container.height / 2) - (end.height / 2)
         }, end];
      },
      "bottomExpand" : function(container, start, end) {
         return [{
            "left" : (container.width / 2) - (start.width / 2),
            "top" : (container.height / 2) + (end.height / 2)
         }, end];
      },
      "leftExpand" : function(container, start, end) {
         return [{
            "left" : (container.width / 2) - (end.width / 2),
            "top" : (container.height / 2) - (start.height / 2)
         }, end];
      },
      "rightExpand" : function(container, start, end) {
         return [{
            "left" : (container.width / 2) + (end.width / 2),
            "top" : (container.height / 2) - (start.height / 2)
         }, end];
      }
	}
	
	AnimatedDialog.prototype.background = function(part) {
		if (typeof this.options.background === "object" && this.options.background[part]) {
			return this.options.background[part];
		}
		return this.options.background;
	}

	AnimatedDialog.prototype.toggle = function() {
		if (this.showing = !this.showing) {
			var offset = this.ele.offset();
			this.style = {
				"maxWidth" : this.ele.outerWidth(),
				"maxHeight" : this.ele.outerHeight(),
				"top" : offset.top - $(window).scrollTop(),
				"left" : offset.left,
				"backgroundColor" : this.background("start")
			};
			
			this.noScroll();

			this.wrap.addClass("show");
			setTimeout($.proxy(function() {
				this.wrap.addClass("frosted");
			}, this), 16);

			this.dialog.css(this.style).addClass("moving");

			this.ele.addClass("animated-dialog-hidden");

			var size = $("<div></div>").css({
				"position" : "absolute",
				"width" : "100%",
				"height" : "100%",
				"maxWidth" : parseInt(this.options.width) || 800,
				"maxHeight" : parseInt(this.options.height) || 600
			}).appendTo(this.root);

			var dialogSize = {
				"width" : size.width(),
				"height" : size.height()
			}
			
			var container = $(window),
				 containerW = container.width(),
				 containerH = container.height();
			
			var stages = (typeof this.options.tween === "function" ? this.options.tween : (this.tweens[this.options.tween] || this.tweens.centerExpand))({
				"width" : containerW,
				"height" : containerH
			}, {
				"width" : this.style.maxWidth,
				"height" : this.style.maxHeight,
				"left" : this.style.left,
				"top" : this.style.top,
				"backgroundColor" : this.style.backgroundColor
			}, {
				"width" : dialogSize.width,
				"height" : dialogSize.height,
				"left" : (containerW / 2) - (dialogSize.width / 2),
				"top" : (containerH / 2) - (dialogSize.height / 2),
				"backgroundColor" : this.background("end")
			})

			this.tween = new SimpleTween(this.dialog, $.proxy(this.complete, this));
			for (var x = 0; x < stages.length; x++) {
				var stage = stages[x], add = {}, remap = {
					"width" : "maxWidth",
					"height" : "maxHeight"
				}
				for (var prop in stage) {
					if (remap[prop]) {
						add[remap[prop]] = stage[prop];
					} else {
						add[prop] = stage[prop];
					}
				}
				this.tween.add(add);
			}
			size.remove();
			this.tween.next();
		} else {
			this.dialog.addClass("moving");
			this.wrap.removeClass("frosted");
			this.dialog.removeClass("animated-dialog-showing");
			
			if (transitionEnd) {
				this.content.onTransitionEnd($.proxy(this.tween.reverse, this.tween));
			} else {
				this.tween.reverse();
			}
			this.content.addClass("hide");
		}
	};

	AnimatedDialog.prototype.complete = function() {
		this.dialog.removeClass("moving");

		if (this.showing) {
			this.content.removeClass("hide");
			this.dialog.addClass("animated-dialog-showing");
			this.ele.trigger("ad.showing");
		} else {
			this.wrap.removeClass("show");
			this.root.css(this.reset);
			this.ele.removeClass("animated-dialog-hidden");
		}
	}

	AnimatedDialog.prototype.noScroll = function(reset) {
		this.reset = {
			"overflow" : this.root.css("overflow"),
			"paddingRight" : this.root.css("paddingRight")
		};

		var width = this.root.width();
		var staticWidth = this.root.css({
			"overflow" : "hidden"
		}).width();
		if (staticWidth > width) {
			this.root.css({
				"paddingRight" : (staticWidth - width) + "px"
			});
		}
	};

	var defaults = {
		// Selector to finding the content to put in the dialog
		"content" : "~ .animated-dialog-content",
		// Selector to find the clickable item, in the content, that will close the dialog
		"closeable" : ".animated-dialog-close",
		// The minimum width of the dialog element in px, resizes if window is smaller than defined
		"width" : 800,
		// The minimum height of the dialog element in px, resizes if window is smaller than defined
		"height" : 600,
		//  The background colour for the dialog
      // Can be an <object> with start and end colours. Useful if you have a different coloured button to the background
      // of your dialog
      // e.g.
      // "background": {
      //     "start": "#1565C0",
      //     "end": "#fff"
      // }
		"background" : "#fff",
		// The animation tween, can be either a <string> or <function>
		// <string> value options are "centerExpand", "topExpand", "bottomExpand", "leftExpand", "rightExpand"
		// <function> return <array> of <object>s, each element is a stage in the tween.
		// Possible values to tween are top, left, width, height and backgroundColor
		// Passed parameters to the function are 
		//     <object> - container element of the dialog
		//     <object> - the start tween parameters
		//     <object> - the end tween parameters, this object should be included as the last element in the array
		//
		// e.g.
		// "tween": function(container, start, end) {
		//     return [{
		//        "left" : (container.width / 2) - (start.width / 2),
		//        "top" : (container.height / 2) - (start.height / 2)
		//     }, end];
		// }
		"tween" : "centerExpand"
	};

	var functs = {};

	$.fn.animatedDialog = function(options) {
		if ("string" === typeof options) {
			if ("function" === typeof functs[options]) {
				functs[options].apply(this, Array.prototype.slice.call(arguments, 1));
			}
		} else {
			return this.each(function() {
				var ele = $(this), animateddialog = ele.data("animateddialog");

				if (!animateddialog) {
					animateddialog = new AnimatedDialog(ele, $.extend({}, defaults, options || {}));
					ele.data("animateddialog", animateddialog);
				}
			});
		}
	};

})(jQuery);