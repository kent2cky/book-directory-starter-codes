const express = require('express');

const router = express.Router();
const mysql = require('mysql');

const con = mysql.createConnection({
    host: "209.97.131.142",
    user: "chidiogo",
    password: "c#1di0g0",
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