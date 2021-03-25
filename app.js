const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();

/*app.use((req, res) => {
   res.json({ message: 'Votre requête a bien été reçue !' }); 
});*/

app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
   next();
 });

/*app.use(express.json());*/
/*TODO problem: when i use a code below and use angular app to insert , the get method doesnt send 
   anything,
*/

app.post('/api/add', (req, res, next) => {
   /*var stuff = {}

   const db = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database : "tp1_m1dfs"
  });*/

  // test if req.params.name equal to _ALL , number , String
  /*db.connect(function(err) {
    if (err) throw err;
       db.query("insert into produits values (null,'?','2021-01-25 00:00:00','2021-01-25 00:00:00','?','?')",[res.params.id,res.params.id,res.params.prix], function (err, result) {
          if (err){
            stuff["status"] = 400  
            stuff["status_message"] = "Product not inserted"
          }else{
            stuff["status"] = 200
            stuff["status_message"] = "Product inserted"
          }
          res.json(stuff)
        });
  });*/
  res.json({'price ' : req.body})
 });
   /*
      supprimer le produit
   */ 
 app.delete('/api/delete/:id', (req, res, next) => {
   const db = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database : "tp1_m1dfs"
  });

  // test if req.params.name equal to _ALL , number , String
  db.connect(function(err) {
    if (err) throw err;
       db.query("DELETE FROM produits WHERE id_produit = ?",[req.params.id], function (err, result) {
          if (err){
            stuff["status"] = 400  
            stuff["status_message"] = "Product does not deleted"
          }else{
            stuff["status"] = 200
            stuff["status_message"] = "Product was deleted"
          }
          res.json(stuff)
        });
  });
 });
 /*
   mettre à jour le produit
 */ 
 app.put('/api/update/:id/:prix', (req, res, next) => {
   const db = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database : "tp1_m1dfs"
  });

  // test if req.params.name equal to _ALL , number , String
  db.connect(function(err) {
      if (err) throw err;
         db.query("update produits set prix = ? where id_produit = ? ",[req.params.data.value,req.params.data.id], function (err, result) {
            if (err){
               stuff["status"] = 400  
               stuff["status_message"] = "Product does not updated"
            }else{
               stuff["status"] = 200
               stuff["status_message"] = "Product was updated"
            }
            res.json(stuff)
         });
   });
  });
/*
   afficher les produits dans la page lecture et visualisation
*/

app.get('/api/name/:name', (req, res, next) => {
   var stuff = {}

     const db = mysql.createConnection({

      host: "localhost",
   
      user: "root",
   
      password: "",

      database : "tp1_m1dfs"
   
    });

    // test if req.params.name equal to _ALL , number , String
    db.connect(function(err) {
      if (err) throw err;
      if(req.params.name === '_ALL'){
         db.query("SELECT * from produits", function (err, result) {
            if (err){
              stuff["status"] = 400  
              stuff["status_message"] = "Product Found"
            }else{
              stuff["status"] = 200
              stuff["status_message"] = "Product Found"
              stuff["data"] = result
            }
            res.json(stuff)
          });
      }else if(isNaN(req.params.name)){
         db.query("SELECT * from produits where nom = ?",[req.params.name], function (err, result) {
            if (err){
              stuff["status"] = 400  
              stuff["status_message"] = "Product Found"
            }else{
              stuff["status"] = 200
              stuff["status_message"] = "Product Found"
              stuff["data"] = result
            }
            res.json(stuff)
          });
      }else{
         db.query("SELECT * from produits where id_produit = ?",[req.params.name], function (err, result) {
            if (err){
               stuff["status"] = 400  
               stuff["status_message"] = "Product Found"
            }else{
               stuff["status"] = 200
               stuff["status_message"] = "Product Found"
               stuff["data"] = result
            }
            res.json(stuff)
            });
      }
    });
 });
/*
   pour afficher la courbe, liste date et liste prix 
*/
app.get('/api/id/:name', (req,res,next) => {
   var stuff = {}
   
   const db = mysql.createConnection({

      host: "localhost",
   
      user: "root",
   
      password: "",

      database : "tp1_m1dfs"
   
   });

   db.connect(function(err) {
      
      let valueprix = [];
      
      let valuedate = []
      let evolutions = {}
      if (err) throw err;
      db.query("SELECT * FROM produits, evolutions where evolutions.id_produit = produits.id_produit and produits.id_produit = ? order by evolutions.date_up", [req.params.name], function(err, result){
         stuff["status"] = 200
         stuff["status_message"] = "Products Found"
         stuff["data"] = result
         //evolutions
         for(let i=0 ;i < result.length ; i ++ ){
            valueprix.push(result[i].prix)
            valuedate.push(result[i].date_up)
         }
         
         evolutions = {"evolutions" : {"date" :valuedate, "prix" :  valueprix}}

         stuff["data"] = evolutions
         
         res.json(stuff)
      });
   });
});


module.exports = app;