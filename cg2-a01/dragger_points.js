/*
 *
 * Module: dragger_points
 *
 */

/* requireJS module definition */
define(["util", "scene"], 
       (function(Util,Scene) {

    "use strict";

    var DraggerPoints = function(curve) {

        this.curve = curve;
        this.isDragger = true;
      
    };
	
    DraggerPoints.prototype.draw = function (context) {

		context.beginPath();

		context.moveTo(this.curve.p0[0], this.curve.p0[1]);
        context.lineTo(this.curve.p1[0], this.curve.p1[1]);
		context.lineTo(this.curve.p2[0], this.curve.p2[1]);
		context.lineTo(this.curve.p3[0], this.curve.p3[1]);

		context.lineWidth = 1;
        context.strokeStyle = "#ffb6c1";
        context.stroke();

    };

    DraggerPoints.prototype.isHit = function (context,mousePos) {
		
		return false;

    };
        
    DraggerPoints.prototype.mouseDrag = function (dragEvent) {

		return;
            
    };

    return DraggerPoints;

})); // define
