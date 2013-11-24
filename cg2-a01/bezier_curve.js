/*
 *
 * Module: bezier_curve
 *
 */


/* requireJS module definition */
define(["util", "vec2", "scene", "point_dragger", "dragger_points", "parametric_curve"], 
       (function(Util,vec2,Scene, PointDragger, DraggerPoints, ParametricCurve) {
       
    "use strict";

    var BezierCurve = function(p0, p1, p2, p3, lineStyle) {

        console.log("creating bezier curve with p0=["+p0+"] p1=["+p1+"] p2=["+p2+"] p3=["+p3+"]");
        
        this.lineStyle = lineStyle || { width: "2", color: "#0000AA" };
        
        // control points
        this.p0 = p0 || [50, 50];
        this.p1 = p1 || [75, 75];
        this.p2 = p2 || [75, 25];
        this.p3 = p3 || [100, 50];
        
        // bernstein polynom
        this.b30 = function(t) { return Math.pow(1 - t, 3); };
        this.b31 = function(t) { return 3 * t * Math.pow(1 - t, 2); };
        this.b32 = function(t) { return 3 * t * t * (1 - t); };
        this.b33 = function(t) { return t * t * t };
        
        this.f_t = function(t) {         
             return (this.p0[0] * this.b30(t) + 
				this.p1[0] * this.b31(t) +
				this.p2[0] * this.b32(t) +
				this.p3[0] * this.b33(t)); 
        };
                
		this.g_t = function(t) {        
			return (this.p0[1] * this.b30(t) + 
				this.p1[1] * this.b31(t) +
				this.p2[1] * this.b32(t) +
				this.p3[1] * this.b33(t)); 
		};
                
		this.t_min = 0;
		this.t_max = 1;
		this.segments = 50;
		this.tickmarks = true;
        
    };
    
    // BezierCurve inherits form ParametricCurve
    BezierCurve.prototype = new ParametricCurve();
    
    BezierCurve.prototype.createDraggers = function() {

        var draggerStyle = { radius:4, color: this.lineStyle.color, width:0, fill:true }
        var draggerStylePull = { radius:4, color: this.lineStyle.color, width:0, fill:false }
        var draggers = [];
        
        var that = this;
        var getP0 = function() { return that.p0; };
        var getP1 = function() { return that.p1; };
        var getP2 = function() { return that.p2; };
        var getP3 = function() { return that.p3; };
        var setP0 = function(dragEvent) { that.p0 = dragEvent.position; };
        var setP1 = function(dragEvent) { that.p1 = dragEvent.position; };
        var setP2 = function(dragEvent) { that.p2 = dragEvent.position; };
        var setP3 = function(dragEvent) { that.p3 = dragEvent.position; };
        draggers.push( new PointDragger(getP0, setP0, draggerStyle) );
        draggers.push( new PointDragger(getP1, setP1, draggerStylePull) );
        draggers.push( new PointDragger(getP2, setP2, draggerStylePull) );
        draggers.push( new PointDragger(getP3, setP3, draggerStyle) );
        
        draggers.push( new DraggerPoints(that));
        
        return draggers;
        
    };
    
    return BezierCurve;

})); // define