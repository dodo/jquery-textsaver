/*
	textSaver.js v0.1.2
	Copyright (c) 2011 David Hu (http://davidhu.me)
	Licensed under the GNU General Public License v3 (http://www.gnu.org/licenses/gpl.html)
	
	For more information, see: http://davidhu.me/textsaver
*/

(function($) {
	var tsVars = {
		noNameCounter: 0,
		n: 0, // used in case we need to keep track of multiple forms (for submitting/clearing purposes)
		tsNames: []
	};
	$.fn.textSaver = function() {
		return this.each(function() {
			var m = tsVars.n;
			tsVars.tsNames[m] = [];
			if($(this).get(0).tagName == "FORM") {
				$(this).children("input, textarea").each(function() {
					if($(this).data('textSaver'))
						$(this).data('textSaver').destroy();
					$(this).data('textSaver', new TextSaver($(this), m));
				});
				$(this).submit(function() {
					for(var k in tsVars.tsNames[m]) {
						localStorage.removeItem(tsVars.tsNames[m][k]);
					}
				});
			} else {
				if($(this).data('textSaver'))
					$(this).data('textSaver').destroy();
				$(this).data('textSaver', new TextSaver($(this), m));
			}
			tsVars.n++;
		});
	}
	
	function TextSaver(obj, m) {
		this.obj = obj;
		this.tsName = get_tsName(obj, m);
		if(localStorage.getItem(this.tsName) != null) {
			obj.val(localStorage.getItem(this.tsName));
		}
		var my = this;
		obj.bind('keyup', this.onkeyup = function () {
			localStorage.setItem(my.tsName, my.obj.val());
		});
	}
	
	TextSaver.prototype.destroy = function () {
		this.obj.unbind('keyup', this.onkeyup);
		this.clear();
	};

	TextSaver.prototype.clear = function () {
		localStorage.removeItem(this.tsName);
	};

	// expose constructor
	$.TextSaver = TextSaver;

	/* helper */

	function get_tsName(obj, m) {
		var tsName = obj.parent().attr('id');
		if(!tsName) {
			tsName = window.location.host+window.location.pathname;
		}
		if(obj.attr('name')) {
			tsName += '_'+obj.attr('name');
		} else if(obj.attr('id')) {
			tsName += '_'+obj.attr('id');
		} else {
			tsName += "_"+obj.get(0).tagName;
			tsName += tsVars.noNameCounter;
			tsVars.noNameCounter++;
		}
		tsName += "_ts";
		tsVars.tsNames[m].push(tsName);
		return tsName;
	}

})(jQuery);
