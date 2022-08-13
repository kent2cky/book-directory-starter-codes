# book-directory-starter-codes
starter codes for our book directory app

Found in this repository are the complete steps to create a fully functional
book directory application. The stacks used here is **expressjs,** **ejs,** and **mysql**.

## Step 1: Get the starter codes
Fork this repository and then clone it into your local machine.

## Install Dependencies
Here we install all the dependencies necessary for building our app by running 
`npm install`

## Create SSR Pages

1. in the project root folder create a file and name it "serverfile.js"
2. inside "servefile.js" add the following codes:

```
  const express = require('express');
  const mysql = require('mysql');
  const formidable = require('express-formidable');
  const routes = require('./routes/routes');

  const app = express();
  app.use(formidable());
  app.use('/api', routes)

  const con = mysql.createConnection({
    host: ******,
    user: ******,
    password: ******,
    database: "book_directory"
  });

  function handleError(res, errMsg){
    res.render('errors/index', {errMsg});
  }

  con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
      });

  // set the view engine to ejs
  app.set('view engine', 'ejs');

  // use res.render to load up an ejs view file

  // index page
  app.get('/', function(req, res) { 
      console.log('this is req.query', req.query);

      const sql = "select * from books where 1";
      con.query(sql, function (err, books) {
          if (err) {
            handleError(res);
          }else{
            res.render('pages/index', {books});
          }
      }); 
  });

  // about page
  app.get('/books', function(req, res) {
    res.render('pages/books');
  });


  // about page
  app.get('/about', function(req, res) {
    res.render('pages/about');
  });

  // new-book
  app.get('/new-book', function(req, res) {
    res.render('pages/new-book');
  });

  // new-book
  app.post('/new-book', function(req, res) {
    const formData = req.fields;
    const sql = `insert into books (name, author, publish_year) values (${mysql.escape(formData.bookName)}, ${mysql.escape(formData.author)}, ${mysql.escape(formData.publishYear)})`;
    console.log('this is sql', sql);
      con.query(sql, function (err, result) {
          if (err) {
             handleError(res);
          }else{
            console.log("books: " + result);
            res.redirect('/');
          }

      }); 
  });

  // edit-book
  app.get('/edit-book', function(req, res) {
      const id = req.query.id;
      const sql = `select * from books where id = ${mysql.escape(id)}`;
    console.log('this is sql', sql);
      con.query(sql, function (err, result) {
          if (err) {
             handleError(res);
          }else{
            const book = result[0];
            console.log("book: ", book);
            res.render('pages/edit-book', {book});
          }
      }); 
  });

  // new-book
  app.post('/edit-book', function(req, res) {
      const formData = req.fields;

    const sql = `update books set 
                  name = ${mysql.escape(formData.bookName)}, 
                  author = ${mysql.escape(formData.author)}, 
                  publish_year = ${mysql.escape(formData.publishYear)}
                where id = ${mysql.escape(formData.id)}`;
      con.query(sql, function (err, result) {
          if (err) {
            console.log('this is error, ',err);
            const errorMsg = err.sqlMessage;
            console.log(errorMsg)

            handleError(res, errorMsg);
          }
          else{
            console.log("books: " + result);
            res.redirect('/'); 
          }
      }); 
  });

  app.post('/delete-book', function(req, res) {
        const id = req.fields.id;

      const sql = `delete from books where id = ${mysql.escape(id)}`;
      console.log('this is sql', sql);
        con.query(sql, function (err, result) {
            if (err) {
              handleError(res);
            }else{
              res.redirect('/'); 
            }
        }); 
  });


  app.listen(8080);
  console.log('Server is listening on port 8080');

```
## Test Api Routes
1. open the terminal in your local machine and navigate to the project folder
2. run `node serverfile.js`
3. go to your browser and visit "localhost:8080"

## Create Api Routes

1. create a folder called routes
2. inside the newly created folder, create a file and name it "routes.js"
3. go to serverfile.js and add the following at the top of the file: 
  ``` 
      const routes = require('./routes/routes');
      app.use('/api', routes);
  ```
4. inside the routes.js file add the following codes:
  ```
      const express = require('express');

      const router = express.Router();
      const mysql = require('mysql');

      const con = mysql.createConnection({
          host: ******,
          user: ******,
          password: ******,
          database: "book_directory"
        });

        con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            });

        function handleApiError(res, errMsg){
          res.send('error handling request');
        }

      //Post Method
      router.post('/post', (req, res) => {
          const formData = req.fields;
          const sql = `insert into books (name, author, publish_year) values (${mysql.escape(formData.bookName)}, ${mysql.escape(formData.author)}, ${mysql.escape(formData.publishYear)})`;
          console.log('this is sql', sql);
          con.query(sql, function (err, result) {
              if (err) {
                 handleApiError(res);
              }else{
                console.log("books: " + result);
                res.send('Post API');
              }

          }); 
      })

      //Get all Method
      router.get('/getAll', (req, res) => {
          const sql = "select * from books where 1";
          con.query(sql, function (err, books) {
              if (err) {
                handleApiError(res);
              }else{
                  res.send(books);
              }
          }); 
      })

      //Get by ID Method
      router.get('/getOne/:id', (req, res) => {
          const sql = `select * from books where id = ${req.params.id}`;
          con.query(sql, function (err, books) {
              if (err) {
                handleApiError(res);
              }else{
                  res.send(books);
              }
          }); 
      })

      //Update by ID Method
      router.patch('/update/:id', (req, res) => {
          const id = req.params.id;
          const updatedData = req.fields;
          console.log('this is updatedData: ', updatedData);

          const sql = `update books set 
                      name = ${mysql.escape(updatedData.bookName)}, 
                      author = ${mysql.escape(updatedData.author)}, 
                      publish_year = ${mysql.escape(updatedData.publishYear)}
                    where id = ${mysql.escape(id)}`;
          con.query(sql, function (err, result) {
              if (err) {
                console.log('this is error, ',err);
                const errorMsg = err.sqlMessage;
                console.log(errorMsg)

                handleApiError(res, errorMsg);
              }
              else{
                console.log("books: " + result);
                res.send(updatedData);
              }
          }); 
      })

      //Delete by ID Method
      router.delete('/delete/:id', (req, res) => {
          const id = req.fields.id;
          const sql = `delete from books where id = ${mysql.escape(id)}`;
          console.log('this is sql', sql);
          con.query(sql, function (err, result) {
              if (err) {
                  handleApiError(res);
              }else{
                  res.send(result);
              }
          }); 
      })

      module.exports = router;
   
  ```
## Test Api Routes
1. open the terminal in your local machine and navigate to the project folder
2. run `node serverfile.js`
3. from your frontend client (i.e. postman, rested, etc), send request to the endpoint.
