#csv-array
> Simple. lighweight, intelligent CSV-parser for nodeJS

## Dependencies
This package got only one dependencies of "line-by-line".

## Change log
* Dramatic improvement in speed.. Please forget version 0.0.1x


## Usage Guide
### Installing

The installation is just a command

```
 npm install csv-array
```

After installing the package you can use the "parseCSV" method as follows
```
 parseCSV("CSV-file-name.csv", callBack, considerFirstRowAsHeading)
   /*
      Where callBack is the method which have the output array as argument, and you can do 
      anything you like inside the function with the array

      "considerFirstRowAsHeading" is a configuration variable which holds "true" value 
      by default. If it is true or nothing then the first row of the csv data will be considered 
      as heading and the out put data will use the first row's content as attribute names.
      If it is "false" then all of the rows of the file will be returned as array.

      See example below.
   */
```
### Example

test.csv file contains

```
 Question Statement,Option 1,Option 2,Option 3,Option 4,Option 5,Answer,Deficulty,Category
this is a test question answer it?,answer 1,answer 2,answer3,answer 4,,answer 2,3,test
this is another test question answer it?,"answer1,answer2","answer2,answer3","answer4,answer5","answer5,answer6","answer7,answer8","answer1,answer2",2,test
```
```javascript
 var csv = require('csv-array');
 csv.parseCSV("test.csv", function(data){
   console.log(JSON.stringify(data));
 });
``` 

Output
```json
[  
   {  
      "Question Statement":"this is a test question answer it?",
      "Option 1":"answer 1",
      "Option 2":"answer 2",
      "Option 3":"answer3",
      "Option 4":"answer 4",
      "Option 5":"",
      "Answer":"answer 2",
      "Deficulty":"3",
      "Category":"test"
   },
   {  
      "Question Statement":"this is another test question answer it?",
      "Option 1":"answer1,answer2",
      "Option 2":"answer2,answer3",
      "Option 3":"answer4,answer5",
      "Option 4":"answer5,answer6",
      "Option 5":"answer7,answer8",
      "Answer":"answer1,answer2",
      "Deficulty":"2",
      "Category":"test"
   }
]
```

```javascript
 var csv = require('csv-array');
 csv.parseCSV("test.csv", function(data){
   console.log(JSON.stringify(data));
 }, false);
```
Output
```json
[  
   [  
      "Question Statement",
      "Option 1",
      "Option 2",
      "Option 3",
      "Option 4",
      "Option 5",
      "Answer",
      "Deficulty",
      "Category"
   ],
   [  
      "this is a test question answer it?",
      "answer 1",
      "answer 2",
      "answer3",
      "answer 4",
      "",
      "answer 2",
      "3",
      "test"
   ],
   [  
      "this is another test question answer it?",
      "answer1,answer2",
      "answer2,answer3",
      "answer4,answer5",
      "answer5,answer6",
      "answer7,answer8",
      "answer1,answer2",
      "2",
      "test"
   ]
]
``` 

```javascript
 var csv = require('csv-array');
 csv.parseCSV("test.csv", function(data){
   console.log(JSON.stringify(data));
 }, true);
 /*
   The output will be as same as
   var csv = require('csv-array');
    csv.parseCSV("test.csv", function(data){
      console.log(JSON.stringify(data));
    });
 */
``` 
Output
```json
[  
   {  
      "Question Statement":"this is a test question answer it?",
      "Option 1":"answer 1",
      "Option 2":"answer 2",
      "Option 3":"answer3",
      "Option 4":"answer 4",
      "Option 5":"",
      "Answer":"answer 2",
      "Deficulty":"3",
      "Category":"test"
   },
   {  
      "Question Statement":"this is another test question answer it?",
      "Option 1":"answer1,answer2",
      "Option 2":"answer2,answer3",
      "Option 3":"answer4,answer5",
      "Option 4":"answer5,answer6",
      "Option 5":"answer7,answer8",
      "Answer":"answer1,answer2",
      "Deficulty":"2",
      "Category":"test"
   }
]
```
If any issue found feel free to contact me at sguha1988.life@gmail.com
