# dots.js

An script to make a dots effect based on images and mouse position.

### Usage

```javascript
var image_src = "img/my_image.jpg",
    container = document.getElementById("container"),
    dots = new Dots(image_src, container);
```

---

### Parameters

new Dots(image_src, container [,options]);

Required:
* **image_src:** Source of the image, that would be a link or a base64 source.
* **container:** The DOM container for the canvas element.

Optional:
* **options:** An object of properties and values to pass to the method.
  *  **width** (Default: **Image width**): An integer value that define the width of the canvas.
  *  **height** (Default: **Image height**): An integer value that define the height of the canvas.
  *  **amount** (Default: **0.7**): This property can take a value from 0.0 - 1.0. The lower value, less dots to generate the image.
  *  **tolerance** (Default: **0.8**): This property can take a value from 0.0 - 1.0. The lower value, less light colors are taken.
  *  **rgba** (Default: **Image color**): An array value that contain the rgba color format to paint the dots when they are moving away.

```javascript
var image_src = "img/my_image.jpg",
    container = document.getElementById("container"),
    dots = new Dots(image_src, container,{
        width: 500,
        height: 300,
        amount: 0.9,
        tolerance:0.5,
        rgba: [130, 177, 30, 1]
    });