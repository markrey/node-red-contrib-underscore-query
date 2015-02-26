node-red-comtrib-underscore-query
=============================
underscore-query node for node-red 

Based on the package underscore-query https://github.com/davidgtonge/underscore-query

##Install
Run the following command in the root directory of your Node-RED install
```
  npm install node-red-contrib-underscore-query
```

## Configuration 

## Config options
### $equal
Performs a strict equality test using `===`. If no operator is provided and the query value isn't a regex then `$equal` is assumed.

If the attribute in the model is an array then the query value is searched for in the array in the same way as `$contains`

If the query value is an object (including array) then a deep comparison is performed using underscores `_.isEqual`

```javascript
_.query( MyCollection, { title:"Test" });
// Returns all models which have a "title" attribute of "Test"

_.query( MyCollection, { title: {$equal:"Test"} }); // Same as above

_.query( MyCollection, { colors: "red" });
// Returns models which contain the value "red" in a "colors" attribute that is an array.

MyCollection.query ({ colors: ["red", "yellow"] });
// Returns models which contain a colors attribute with the array ["red", "yellow"]
```

### $contains
Assumes that the model property is an array and searches for the query value in the array

```js
_.query( MyCollection, { colors: {$contains: "red"} });
// Returns models which contain the value "red" in a "colors" attribute that is an array.
// e.g. a model with this attribute colors:["red","yellow","blue"] would be returned
```

### $ne
"Not equal", the opposite of $equal, returns all models which don't have the query value

```js
_.query( MyCollection, { title: {$ne:"Test"} });
// Returns all models which don't have a "title" attribute of "Test"
```

### $lt, $lte, $gt, $gte
These conditional operators can be used for greater than and less than comparisons in queries

```js
_.query( MyCollection, { likes: {$lt:10} });
// Returns all models which have a "likes" attribute of less than 10
_.query( MyCollection, { likes: {$lte:10} });
// Returns all models which have a "likes" attribute of less than or equal to 10
_.query( MyCollection, { likes: {$gt:10} });
// Returns all models which have a "likes" attribute of greater than 10
_.query( MyCollection, { likes: {$gte:10} });
// Returns all models which have a "likes" attribute of greater than or equal to 10
```

These may further be combined:

```js
_.query( MyCollection, { likes: {$gt:2, $lt:20} });
// Returns all models which have a "likes" attribute of greater than 2 or less than 20
// This example is also equivalent to $between: [2,20]
_.query( MyCollection, { likes: {$gte:2, $lte:20} });
// Returns all models which have a "likes" attribute of greater than or equal to 2, and less than or equal to 20
_.query( MyCollection, { likes: {$gte:2, $lte: 20, $ne: 12} });
// Returns all models which have a "likes" attribute between 2 and 20 inclusive, but not equal to 12
```



### $between
To check if a value is in-between 2 query values use the $between operator and supply an array with the min and max value

```js
_.query( MyCollection, { likes: {$between:[5,15] } });
// Returns all models which have a "likes" attribute of greater than 5 and less then 15
```

### $in
An array of possible values can be supplied using $in, a model will be returned if any of the supplied values is matched

```js
_.query( MyCollection, { title: {$in:["About", "Home", "Contact"] } });
// Returns all models which have a title attribute of either "About", "Home", or "Contact"
```

### $nin
"Not in", the opposite of $in. A model will be returned if none of the supplied values is matched

```js
_.query( MyCollection, { title: {$nin:["About", "Home", "Contact"] } });
// Returns all models which don't have a title attribute of either
// "About", "Home", or "Contact"
```

### $all
Assumes the model property is an array and only returns models where all supplied values are matched.

```js
_.query( MyCollection, { colors: {$all:["red", "yellow"] } });
// Returns all models which have "red" and "yellow" in their colors attribute.
// A model with the attribute colors:["red","yellow","blue"] would be returned
// But a model with the attribute colors:["red","blue"] would not be returned
```

### $any
Assumes the model property is an array and returns models where any of the supplied values are matched.

```js
_.query( MyCollection, { colors: {$any:["red", "yellow"] } });
// Returns models which have either "red" or "yellow" in their colors attribute.
```

### $size
Assumes the model property has a length (i.e. is either an array or a string).
Only returns models the model property's length matches the supplied values

```js
_.query( MyCollection, { colors: {$size:2 } });
// Returns all models which 2 values in the colors attribute
```

### $exists or $has
Checks for the existence of an attribute. Can be supplied either true or false.

```js
_.query( MyCollection, { title: {$exists: true } });
// Returns all models which have a "title" attribute
_.query( MyCollection, { title: {$has: false } });
// Returns all models which don't have a "title" attribute
```

### $like
Assumes the model attribute is a string and checks if the supplied query value is a substring of the property.
Uses indexOf rather than regex for performance reasons

```js
_.query( MyCollection, { title: {$like: "Test" } });
//Returns all models which have a "title" attribute that
//contains the string "Test", e.g. "Testing", "Tests", "Test", etc.
```

### $likeI
The same as above but performs a case insensitive search using indexOf and toLowerCase (still faster than Regex)

```js
_.query( MyCollection, { title: {$likeI: "Test" } });
//Returns all models which have a "title" attribute that
//contains the string "Test", "test", "tEst","tesT", etc.
```

### $regex
Checks if the model attribute matches the supplied regular expression. The regex query can be supplied without the `$regex` keyword

```js
_.query( MyCollection, { content: {$regex: /coffeescript/gi } });
// Checks for a regex match in the content attribute
_.query( MyCollection, { content: /coffeescript/gi });
// Same as above
```

### $cb
A callback function can be supplied as a test. The callback will receive the attribute and should return either true or false.
`this` will be set to the current model, this can help with tests against computed properties

```js
_.query( MyCollection, { title: {$cb: function(attr){ return attr.charAt(0) === "c";}} });
// Returns all models that have a title attribute that starts with "c"

_.query( MyCollection, { computed_test: {$cb: function(){ return this.computed_property() > 10;}} });
// Returns all models where the computed_property method returns a value greater than 10.
```

For callbacks that use `this` rather than the model attribute, the key name supplied is arbitrary and has no
effect on the results. If the only test you were performing was like the above test it would make more sense
to simply use `MyCollection.filter`. However if you are performing other tests or are using the paging / sorting /
caching options of backbone query, then this functionality is useful.
