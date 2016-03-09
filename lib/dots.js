/*
 * dots.js 0.0.1
 * Copyright (C) 2015 Ricardo Conde
 * Licence: GNU General Public Licence
 */
var Dots = function ( image_src, container, options ) {
  var settings         = options || {};
  this.tolerance       = settings.tolerance  || 0.8;  
  this.amount          = settings.amount     || 0.7;  
  this.canvasW         = settings.width      || false; 
  this.canvasH         = settings.height     || false; 
  this.rgba            = settings.rgba      || false; 
  this.container       = container; 
  this.particles       = [];      
  this.mouse           = { x: 0, y: 0 };
  this.myCanvas        = document.createElement( "canvas" );
  this.myCanvasContext = this.myCanvas.getContext( "2d" );
  this.create( image_src );
};
Dots.prototype = {
  create: function (image_src) {
    var image  = new Image(),
        self   = this; 
    document.addEventListener('mousemove', function (e) {
      self.mouse.x = e.clientX || e.pageX;
      self.mouse.y = e.clientY || e.pageY;       
    });
    this.animate();
    image.onload = function () {
      var index, average, sw, sh, l, t, i, j,
          rgba = [];
      self.myCanvas.width  = (!self.canvasW) ?  image.width  : self.canvasW;
      self.myCanvas.height = (!self.canvasH) ?  image.height : self.canvasH;
      sw = (self.myCanvas.width / 2) - (image.width / 2);
      sh = (self.myCanvas.height / 2) - (image.height / 2);
      l  = 0;            
      self.container.appendChild( self.myCanvas );
      self.myCanvasContext.drawImage( image, 0, 0 );
      self.imageData = self.myCanvasContext.getImageData( 0, 0, image.width, image.height );
      self.myCanvasContext.clearRect( 0, 0, self.myCanvas.width, self.myCanvas.height );
      for (i = 0; i < self.imageData.height; i++){
        for (j = 0; j < self.imageData.width; j++){
          index = (i * 4) * self.imageData.width + (j * 4);         
          rgba  = [ self.imageData.data[index],
                  self.imageData.data[index + 1],
                  self.imageData.data[index + 2],
                  self.imageData.data[index + 3]];
          average = (rgba[0] + rgba[1] + rgba[2]) / 3;
          t = self.tolerance * 255;         
          if (average < t && Math.random() < self.amount){                        
            self.particles[l] = self.dot(j + sw, i + sh, rgba);
            l++;
          }
        }
      }
      self.draw(); 
    };
    image.src = image_src;
  },
  update: function () {
    mouseX = this.mouse.x - this.container.getBoundingClientRect().left;
    mouseY = this.mouse.y - this.container.getBoundingClientRect().top; 
    var i, p, dx, dy, dSq, f, a,
        md         = 160,
        d          = 0,
        mdSq       = md * md,
        rgba       = [],
        transition = [],
        n          = this.particles.length;
    for (i = 0; i < n; i++) {
      p   = this.particles[i];
      d   = Math.sqrt(Math.pow((p.sx - p.x), 2) + Math.pow((p.sy - p.y), 2));
      dx  = mouseX - p.sx;
      dy  = mouseY - p.sy;
      dSq = (dx * dx) + (dy * dy);
      if (dSq < mdSq) {
        dx    = mouseX - p.x;
        dy    = mouseY - p.y;
        f     = 1 - dSq / mdSq;
        a     = Math.atan2(dy, dx);
        p.vx += Math.cos(a) * f;
        p.vy += Math.sin(a) * f;
      } else {
        p.vx += (p.sx - p.x) * 0.01;
        p.vy += (p.sy - p.y) * 0.01;
      }
      p.x  += p.vx * 4;
      p.y  += p.vy * 4;
      p.vx *= 0.95;
      p.vy *= 0.95;
      this.rgba = this.rgba || [p.rgba[0], p.rgba[1], p.rgba[2], p.rgba[3]];            
      transition[0] = Math.round((this.rgba[0] - p.rgba[0]) * d / 100);
      transition[1] = Math.round((this.rgba[1] - p.rgba[1]) * d / 100);
      transition[2] = Math.round((this.rgba[2] - p.rgba[2]) * d / 100);
      transition[3] = Math.round((this.rgba[3] - p.rgba[3]) * d / 100);
      rgba[0] = p.rgba[0] + transition[0];
      rgba[1] = p.rgba[1] + transition[1];
      rgba[2] = p.rgba[2] + transition[2];
      rgba[3] = p.rgba[3] + transition[3];
      p.a = rgba[0] + "," + rgba[1] + "," + rgba[2] + "," + rgba[3];
    }
    this.draw();      
  },
  draw: function () {
    var p;
    this.myCanvasContext.clearRect(0, 0, this.myCanvas.width, this.myCanvas.height);
    for (p = 0; p < this.particles.length; p++){
      this.myCanvasContext.beginPath();
      this.myCanvasContext.fillStyle = 'rgba(' + this.particles[p].a + ')';
      this.myCanvasContext.fillRect(this.particles[p].x, this.particles[p].y, 1, 1);
      this.myCanvasContext.fill();
    }
  },  
  dot: function(x, y, rgba){
    var dot = {};
    dot.x = x || 0;
    dot.y = y || 0;
    dot.sx = x;
    dot.sy = y;
    dot.a  = 0;
    dot.fx = 0;
    dot.fy = 0;
    dot.vx = 0;
    dot.vy = 0;
    dot.rgba = rgba;
    return dot;
  },
  animate: function(){
    var self = this;     
    this.update();
    window.requestAnimationFrame( function() { self.animate(); } );    
  }
};
