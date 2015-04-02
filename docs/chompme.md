# Chomp Me
*A guide to the data monster language*

- Constructing Expressions
- Data Types
- File Structure
- The Data Expression
	- Clean 
	- The Queue Library
- The Canvas Expression
	- Special Canvas Constructors
	- Special Arguments
- The Elem Expression
	- Special Elem Constructors
- The Funcs Expression
- Freeform Expressions

## Constructing Expressions
Data Monster is syntactically a LISP at its base. That means expressions are wrapped in parentheses and the first item listed is the operative function. So for instance

```
(data: 'filename.tsv')
```

calls the data constructor with the argument of a file name.

Data monster accepts four main classes of expression: 
* _constructor_ expressions — `data`, `canvas` and `elem`— are the building blocks of a monster file;
* _special constructors_, things like `axis-*` or `color`, correspond to common d3 specifiers; 
* _function expressions_ — `clean` and `func` — which pass through  Javascript functions into the generated file; and
* _freeform expressions_, which are any other type of expression.

## Data Types
The data types consumed by the monster mostly make use of familiar Javascript syntax:

`'String'` or `"String"`

`100000`

`{ hash: 'table', key: 'value', 'three': 3 }`

`[an, array, of, 2]`

Functions are an exception. They are wrapped in braces and preceded by a hash/octothorpe:

```
#{function kitty(){ return 'meow';} }
```

## File Structure
The only essential unit of a DM file is the canvas block:

```
(canvas: <width> <height> <appendToElement>)
``` 

One or many canvases will usually be wrapped in a data element:

```
(data: <filepath> 
	(canvas: <width> <height> <appendToElement>)
	(canvas: <width> <height> <appendToElement>)
	(canvas: <width> <height> <appendToElement>))
```

This data will be accessible to all charts drawn in contained canvases, as you would expect.
	
A DM file can contain as many of these blocks as desired.

Canvases themselves will hold `elems` — specifications for SVG elements, like lines, circles, etc.

``` 
(canvas: <width> <height> <appendToElement>
	(elem: <element>: { <required attributes> }))
```

Both data and canvas enclosures also accept function expressions:

```
(funcs: #{<function1>} ... #{<functionN>})
```

## The Data Expression
The data expression currently accepts two arguments: the file path for the data file and `clean` expression. It is specified:

```
(data: '/path/to/file.ext')
```

**Soon**: The data expression will also accept an array of data, a function for data, a key function.

### Clean
Clean is a special expression for passing the types of data-munging transformations you might wrap in a `forEach` callback — which is exactly what clean does. And so

```
(data: 'van_gogh_additional_measurements.tsv'
  (clean: #{ d.Shape_Count = +d.Shape_Count,
             d.ratio = +d["Image_Height/Image_Width "]                    
            }
  )
```

becomes
```javascript
function draw_data_63dc8d12(rawData) {
    rawData.forEach(function(d) {
        d.Shape_Count = +d.Shape_Count, 
				d.ratio = +d["Image_Height/Image_Width "]
    });
    draw_canvas_2e16a1dd(rawData);
}

queue()
    .defer(d3.tsv, 'van_gogh_additional_measurements.tsv')
    .await(function(err, data) {
        if (err) {
            console.log(err);
        }
        draw_data_63dc8d12(data);
    });
```

### The Queue Library
Data Monster–generated files use [the queue library](https://github.com/mbostock/queue) for async file loading, so you will need to include it in your dependencies.

## The Canvas Expression
The canvas expression is the core of the Monster: its thorax, if you will. It takes three required arguments: the width, height, and DOM element to which it will be appended. It also accepts an optional `margin short-hash`.

```
(canvas: <width> <height> [ { <margins> } ] <appendToElement>)
``` 

* `width`: integer, width of the SVG element in pixels  
* `height`: integer, height of the SVG element in pixels  
* `{ margins} `: list of integers for SVG margins, will be applied in clockwise order like CSS margins: `{ top right bottom left }` with shorthand-by-arity allowed. (Eg, if only two arguments are passed they will be  `{top-bottom left-right}`  
* `appendToElement`: string, accepts all CSS selectors  

###### Example
```
(canvas: 1000 600 {20 20 60 60} '#scatterplot')
```

### Special Canvas Constructors
As you might expect for a language built on the notion of idiomatic charts, Data Monster has some special shorthand constructors for common chart elements:

#### `color`
The color expressions accepts a d3 color scale or function as argument. It is optional.
###### Example
```
(color: category10)
```

#### `scale-*`
Scales for `x` and `y` are specified using the `scale-*` syntax. By default, linear scales will be generated using the access property specified as x and y values in the [`elem`'s required specs hash(). The domain will be `[0, maxX/maxY]`. The range for x is `[0, width]` and for y, `[height, 0]`.

Specific scales can be specified in the following manner:
```
(scale-x: linear 
              domain: { 0 maxX } 
              range:  { 0 width } ) 
```

**Soon**: The ability to remove scales entirely.
#### `axis-*`

#### `tooltips`


### Special Arguments
##### d3 scales
##### browser events

## The Elem Expression

### Special Elem Constructors
##### `tooltips`


## The Funcs Expression

## Freeform Expressions
