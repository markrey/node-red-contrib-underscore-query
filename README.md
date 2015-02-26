node-red-comtrib-under-query
=============================
underscore-query node for node-red 

Based on the package underscore-query https://github.com/davidgtonge/underscore-query

##Install
Run the following command in the root directory of your Node-RED install
```
  npm install node-red-contrib-under-query
```

## Configuration 

## Config options
### $equal
Performs a strict equality test using `===`. If no operator is provided and the query value isn't a regex then `$equal` is assumed.

If the attribute in the model is an array then the query value is searched for in the array in the same way as `$contains`

If the query value is an object (including array) then a deep comparison is performed using underscores `_.isEqual`

```javascript
{ title:"Test" }
// Returns all models which have a "title" attribute of "Test"

{ title: {$equal:"Test"} } // Same as above

{ colors: "red" }
// Returns models which contain the value "red" in a "colors" attribute that is an array.

{ colors: ["red", "yellow"] }
// Returns models which contain a colors attribute with the array ["red", "yellow"]
```

### $contains
Assumes that the model property is an array and searches for the query value in the array

```js
{ colors: {$contains: "red"} }
// Returns models which contain the value "red" in a "colors" attribute that is an array.
// e.g. a model with this attribute colors:["red","yellow","blue"] would be returned
```

### $ne
"Not equal", the opposite of $equal, returns all models which don't have the query value

```js
{ title: {$ne:"Test"} }
// Returns all models which don't have a "title" attribute of "Test"
```

### $lt, $lte, $gt, $gte
These conditional operators can be used for greater than and less than comparisons in queries

```js
{ likes: {$lt:10} }
// Returns all models which have a "likes" attribute of less than 10
{ likes: {$lte:10} }
// Returns all models which have a "likes" attribute of less than or equal to 10
{ likes: {$gt:10} }
// Returns all models which have a "likes" attribute of greater than 10
{ likes: {$gte:10} }
// Returns all models which have a "likes" attribute of greater than or equal to 10
```

These may further be combined:

```js
{ likes: {$gt:2, $lt:20} }
// Returns all models which have a "likes" attribute of greater than 2 or less than 20
// This example is also equivalent to $between: [2,20]
{ likes: {$gte:2, $lte:20} }
// Returns all models which have a "likes" attribute of greater than or equal to 2, and less than or equal to 20
{ likes: {$gte:2, $lte: 20, $ne: 12} }
// Returns all models which have a "likes" attribute between 2 and 20 inclusive, but not equal to 12
```

### $between
To check if a value is in-between 2 query values use the $between operator and supply an array with the min and max value

```js
{ likes: {$between:[5,15] } }
// Returns all models which have a "likes" attribute of greater than 5 and less then 15
```

### $in
An array of possible values can be supplied using $in, a model will be returned if any of the supplied values is matched

```js
{ title: {$in:["About", "Home", "Contact"] } }
// Returns all models which have a title attribute of either "About", "Home", or "Contact"
```

### $nin
"Not in", the opposite of $in. A model will be returned if none of the supplied values is matched

```js
{ title: {$nin:["About", "Home", "Contact"] } }
// Returns all models which don't have a title attribute of either
// "About", "Home", or "Contact"
```

### $all
Assumes the model property is an array and only returns models where all supplied values are matched.

```js
{ colors: {$all:["red", "yellow"] } }
// Returns all models which have "red" and "yellow" in their colors attribute.
// A model with the attribute colors:["red","yellow","blue"] would be returned
// But a model with the attribute colors:["red","blue"] would not be returned
```

### $any
Assumes the model property is an array and returns models where any of the supplied values are matched.

```js
{ colors: {$any:["red", "yellow"] } }
// Returns models which have either "red" or "yellow" in their colors attribute.
```

### $size
Assumes the model property has a length (i.e. is either an array or a string).
Only returns models the model property's length matches the supplied values

```js
{ colors: {$size:2 } }
// Returns all models which 2 values in the colors attribute
```

### $exists or $has
Checks for the existence of an attribute. Can be supplied either true or false.

```js
{ title: {$exists: true } }
// Returns all models which have a "title" attribute
{ title: {$has: false } }
// Returns all models which don't have a "title" attribute
```

### $like
Assumes the model attribute is a string and checks if the supplied query value is a substring of the property.
Uses indexOf rather than regex for performance reasons

```js
{ title: {$like: "Test" } }
//Returns all models which have a "title" attribute that
//contains the string "Test", e.g. "Testing", "Tests", "Test", etc.
```

### $likeI
The same as above but performs a case insensitive search using indexOf and toLowerCase (still faster than Regex)

```js
{ title: {$likeI: "Test" } }
//Returns all models which have a "title" attribute that
//contains the string "Test", "test", "tEst","tesT", etc.
```

### $regex
Checks if the model attribute matches the supplied regular expression. The regex query can be supplied without the `$regex` keyword

```js
{ content: {$regex: /coffeescript/gi } }
// Checks for a regex match in the content attribute
{ content: /coffeescript/gi }
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

###Combined 

Multiple queries can be combined together. By default all supplied queries use the `$and` operator. However it is possible
to specify either `$or`, `$nor`, `$not` to implement alternate logic.

#### $and

```js
{ $and: { title: {$like: "News"}, likes: {$gt: 10}}}
// Returns all models that contain "News" in the title and have more than 10 likes.
{ title: {$like: "News"}, likes: {$gt: 10} }
// Same as above as $and is assumed if not supplied
```

#### $or

```js
{ $or: { title: {$like: "News"}, likes: {$gt: 10}}}
// Returns all models that contain "News" in the title OR have more than 10 likes.
```

#### $nor
The opposite of `$or`

```js
{ $nor: { title: {$like: "News"}, likes: {$gt: 10}}}
// Returns all models that don't contain "News" in the title NOR have more than 10 likes.
```

#### $not
The opposite of `$and`

```js
{ $not: { title: {$like: "News"}, likes: {$gt: 10}}}
// Returns all models that don't contain "News" in the title AND DON'T have more than 10 likes.
```

If you need to perform multiple queries on the same key, then you can supply the query as an array:
```js
{
    $or:[
        {title:"News"},
        {title:"About"}
    ]
}
// Returns all models with the title "News" or "About".
```

####Compound

It is possible to use multiple combined queries, for example searching for models that have a specific title attribute,
and either a category of "abc" or a tag of "xyz"

```js
{
    $and: { title: {$like: "News"}},
    $or: {likes: {$gt: 10}, color:{$contains:"red"}}
}
//Returns models that have "News" in their title and
//either have more than 10 likes or contain the color red.
```
