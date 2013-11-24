/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: html_controller
 *
 * Defines callback functions for communicating with various 
 * HTML elements on the page, e.g. buttons and parameter fields.
 *
 */

 
/* requireJS module definition */
define(["jquery", "straight_line", "circle", "parametric_curve", "bezier_curve"], 
       (function($, StraightLine, Circle, ParametricCurve, BezierCurve) {

    "use strict"; 
                
    /*
     * define callback functions to react to changes in the HTML page
     * and provide them with a closure defining context and scene
     */
    var HtmlController = function(context,scene,sceneController) {
    
		$("#Radius").hide();
		$("#x_t").hide();
		$("#y_t").hide();
		$("#t_min").hide();
		$("#t_max").hide();
		$("#Segments").hide();

		
		var evalFunc = function(form) {
            var res = eval("(function(t) { return " + form + ";});");
            return res;
        };
				
				
        // generate random X coordinate within the canvas
        var randomX = function() { 
            return Math.floor(Math.random()*(context.canvas.width-10))+5; 
        };
            
        // generate random Y coordinate within the canvas
        var randomY = function() { 
            return Math.floor(Math.random()*(context.canvas.height-10))+5; 
        };
		
		var randomRadius = function() {
            return Math.floor((Math.random() * (context.canvas.width - 10)) / 2) + 5;
        };
            
        // generate random color in hex notation
        var randomColor = function() {

            // convert a byte (0...255) to a 2-digit hex string
            var toHex2 = function(byte) {
                var s = byte.toString(16); // convert to hex string
                if(s.length == 1) s = "0"+s; // pad with leading 0
                return s;
            };
                
            var r = Math.floor(Math.random()*25.9)*10;
            var g = Math.floor(Math.random()*25.9)*10;
            var b = Math.floor(Math.random()*25.9)*10;
                
            // convert to hex notation
            return "#"+toHex2(r)+toHex2(g)+toHex2(b);
        };
		
        /*
         * event handler for "new line button".
         */
        $("#btnNewLine").click( (function() {
        
            // create the actual line and add it to the scene
            var style = { 
                width: Math.floor(Math.random()*3)+1,
                color: randomColor()
            };
                          
            var line = new StraightLine( [randomX(),randomY()], 
                                         [randomX(),randomY()], 
                                         style );
            scene.addObjects([line]);
			
			$("#ipThickness").attr("value", line.getLineWidth());

            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(line); // this will also redraw
                        
        }));
		
		$("#btnNewCircle").click( (function() {
			
            // create the actual line and add it to the scene
            var style = { 
                width: Math.floor(Math.random()*3)+1,
                color: randomColor()
            };
                          
            var circle = new Circle( [randomX(),randomY()], 
                                         randomRadius(), 
                                         style );
            scene.addObjects([circle]);

			$("#ipRadius").attr("value", circle.getRadius());
			 
            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(circle); // this will also redraw
                        
        }));
		
		$("#btnNewParametricCurve").click( (function() {
			
            // create the actual line and add it to the scene
            var style = { 
                width: Math.floor(Math.random()*3)+1,
                color: randomColor()
            };
                          
            var paraCurve = new ParametricCurve(function(t) { return 100 + 50 * Math.cos(t); }, function(t) { return 150 + 50 * Math.sin(t); }, 0, 4, 8, style);
            scene.addObjects([paraCurve]);
				
            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(paraCurve); // this will also redraw
                        
        }));
		
		$("#btnNewBezierCurve").click( (function() {
			
            var style = { 
                width: Math.floor(Math.random() * 3) + 1,
                color: randomColor()
            };
            
            var p0 = [randomX(),randomY()];
            var p1 = [randomX(),randomY()];
            var p2 = [randomX(),randomY()];
            var p3 = [randomX(),randomY()];
            
            var bezcurve = new BezierCurve(p0,p1,p2,p3,style);
            
            scene.addObjects([bezcurve]);

            sceneController.deselect();
            sceneController.select(bezcurve);
                        
        }));


		        
		sceneController.onSelection(function(obj){
			selectionHandler();
            $('#ipThickness').val(obj.lineStyle.width);
			$('#ipColor').val(obj.lineStyle.color);
			$('#ipRadius').val(obj.radius);
			$('#ipt_min').val(obj.t_min);
			$('#ipt_max').val(obj.t_max);
			$('#ipSegments').val(obj.segments);
		});
		
		sceneController.onObjChange(function(obj){
			$('#ipRadius').val(obj.radius);
		});
		
		var selectionHandler = function() {
			var obj = sceneController.getSelectedObject();
			if (obj instanceof Circle) {
				$("#Radius").show();
				$("#x_t").hide();
				$("#y_t").hide();
				$("#t_min").hide();
				$("#t_max").hide();
				$("#Segments").hide();
			}
                                
			else if (obj instanceof StraightLine) {
				$("#Radius").hide();
				$("#x_t").hide();
				$("#y_t").hide();
				$("#t_min").hide();
				$("#t_max").hide();
				$("#Segments").hide();
			}
			
			else if (obj instanceof ParametricCurve) {
				$("#Radius").hide();
				$("#x_t").show();
				$("#y_t").show();
				$("#t_min").show();
				$("#t_max").show();
				$("#Segments").show();
				if (obj instanceof BezierCurve){
					$("#Radius").hide();
					$("#x_t").hide();
					$("#y_t").hide();
					$("#t_min").hide();
					$("#t_max").hide();
					$("#Segments").show();
				}
			}
        };
		
		$("#ipThickness").change((function() {
                        var obj = sceneController.getSelectedObject();
                        if (obj instanceof Circle || obj instanceof StraightLine || obj instanceof ParametricCurve || obj instanceof BezierCurve) {
                                obj.setLineWidth($("#ipThickness").attr("value"));
                                sceneController.deselect();
                                sceneController.select(obj);
								sceneController.scene.draw(sceneController.context);
                        }
		}));
		
		$("#ipColor").change((function() {
                        var obj = sceneController.getSelectedObject();
                        if (obj instanceof Circle || obj instanceof StraightLine || obj instanceof ParametricCurve || obj instanceof BezierCurve) {
                                obj.setLineColor($("#ipColor").attr("value"));
                                sceneController.deselect();
                                sceneController.select(obj);
								sceneController.scene.draw(sceneController.context);
                        }
        }));
		
		$("#ipRadius").change((function() {
                        var obj = sceneController.getSelectedObject();
                        if (obj instanceof Circle) {
                                obj.setNewRadius(parseInt($("#ipRadius").attr("value")));
                                sceneController.deselect();
                                sceneController.select(obj);
								sceneController.scene.draw(sceneController.context);
                        }
        }));
		
		$("#ipx_t").change((function() {
                        var obj = sceneController.getSelectedObject();
                        if (obj instanceof ParametricCurve) {
                                obj.setNewX_t(evalFunc($("#ipx_t").attr("value")));
                                sceneController.deselect();
                                sceneController.select(obj);
								sceneController.scene.draw(sceneController.context);
                        }
        }));
		
		$("#ipy_t").change((function() {
                        var obj = sceneController.getSelectedObject();
                        if (obj instanceof ParametricCurve) {
                                obj.setNewY_t(evalFunc($("#ipy_t").attr("value")));
                                sceneController.deselect();
                                sceneController.select(obj);
								sceneController.scene.draw(sceneController.context);
                        }
        }));
		
		$("#ipt_min").change((function() {
                        var obj = sceneController.getSelectedObject();
                        if (obj instanceof ParametricCurve) {
                                obj.setNewT_min($("#ipt_min").attr("value"));
                                sceneController.deselect();
                                sceneController.select(obj);
								sceneController.scene.draw(sceneController.context);
                        }
        }));
		
		$("#ipt_max").change((function() {
                        var obj = sceneController.getSelectedObject();
                        if (obj instanceof ParametricCurve) {
                                obj.setNewT_max($("#ipt_max").attr("value"));
                                sceneController.deselect();
                                sceneController.select(obj);
								sceneController.scene.draw(sceneController.context);
                        }
        }));
		
		$("#ipSegments").change((function() {
                        var obj = sceneController.getSelectedObject();
                        if (obj instanceof ParametricCurve) {
                                obj.setNewSegments($("#ipSegments").attr("value"));
                                sceneController.deselect();
                                sceneController.select(obj);
								sceneController.scene.draw(sceneController.context);
                        }
        }));
		
    
    };

    // return the constructor function 
    return HtmlController;


})); // require 



            
