/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: parametric_curve
 * *
 */


/* requireJS module definition */
define(["util", "vec2", "scene", "point_dragger"], 
       (function(Util,vec2,Scene,PointDragger) {
       
    "use strict";

    var ParametricCurve = function(f_t, g_t, t_min, t_max, segments, lineStyle) {

		console.log("creating parametric curve"); 
		
        // draw style for drawing the line
        this.lineStyle = lineStyle || { width: "2", color: "#0000AA" };

        // initial values in case either point is undefined
        this.f_t = f_t || function(t) { return 100 + 50 * Math.cos(t); };;
		this.g_t = g_t || function(t) { return 150 + 50 * Math.sin(t); };;
		this.t_min = t_min || 0;
		this.t_max = t_max || 4;
		this.segments = segments || 4;

        
    };

    ParametricCurve.prototype.draw = function(context) {

		var para = [this.segments];
		var diff = this.t_max - this.t_min ;
		
		for(var i = 0; i <= this.segments; i++) {
			para[i] = [this.f_t((diff/this.segments)*i), this.g_t((diff/this.segments)*i)];
		}
	
		context.beginPath();
		
		for(i = 0; i < this.segments; i++){
			context.moveTo(para[i][0], para[i][1]);
			context.lineTo(para[i+1][0], para[i+1][1]);
		}
		
		context.closePath();
		
		context.lineWidth = this.lineStyle.width;
		context.strokeStyle = this.lineStyle.color;
		
		context.stroke();

	};

    ParametricCurve.prototype.isHit = function(context,pos) {
		var diff = this.t_max - this.t_min;
                        
                for(var i = 0; i < this.segments; i++) {
                        
                        var p0 = [this.f_t((diff / this.segments) * i), this.g_t((diff / this.segments) * i)];
                        var p1 = [this.f_t((diff / this.segments) * (i+1)), this.g_t((diff / this.segments) * (i+1))];

                        var t = vec2.projectPointOnLine(pos, p0, p1);

                        if(t < 0.0 || t > 1.0) {
                                continue; 
                        }

                        var p = vec2.add(p0, vec2.mult( vec2.sub(p1,p0), t ));

                        var d = vec2.length(vec2.sub(p,pos));
        
                        return d <= (this.lineStyle.width/2)+2;

                }

        return false;
    };
    
    // return list of draggers to manipulate this line
    ParametricCurve.prototype.createDraggers = function() {

		return [];
        
    };
	
	ParametricCurve.prototype.getLineColor = function(){
                return this.lineStyle.color;
	};
        
    ParametricCurve.prototype.setLineColor = function(colorValue){
                this.lineStyle.color = colorValue;
	};
        
	ParametricCurve.prototype.getLineWidth = function(){
                return this.lineStyle.width;
	};
        
	ParametricCurve.prototype.setLineWidth = function(widthValue){
                this.lineStyle.width = widthValue;
	};
	
	ParametricCurve.prototype.getX_t = function(){
                return this.f_t;
	};
	
	ParametricCurve.prototype.setNewX_t = function(f_t){
                this.f_t = f_t;
	};
	
	ParametricCurve.prototype.getY_t = function(){
                return this.g_t;
	};
	
	ParametricCurve.prototype.setNewY_t = function(g_t){
                this.g_t = g_t;
	};
	
	ParametricCurve.prototype.getT_min = function(){
                return this.t_min;
	};
	
	ParametricCurve.prototype.setNewT_min = function(t_min){
                this.t_min = t_min;
	};
	
	ParametricCurve.prototype.getT_max = function(){
                return this.t_max;
	};
	
	ParametricCurve.prototype.setNewT_max = function(t_max){
                this.t_max = t_max;
	};

	ParametricCurve.prototype.getSegments = function(){
                return this.Segments;
	};
	
	ParametricCurve.prototype.setNewSegments = function(segments){
                this.segments = segments;
	};	
	
    
    return ParametricCurve;

})); // define

    
