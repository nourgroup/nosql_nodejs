const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
app.use(express.json())    // <==== parse request body as JSON


app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
   next();
 });

 var db = mysql.createConnection({
   host: "localhost",
   user: "root",
   password: "",
   database : "projet_nosql"
});
db.connect(function(err) {
   if(err){
      console.log("db error")
   }else{
      console.log("db succes")
   }
})

   /*
                                    ---inserer un produit
   */ 

/**TODO 
 *  recevoir le numero de la categorie
 * **/
   app.post('/api/add', (req, res, next) => {
   var stuff = {}
   db.query("insert into produits values (null,?,'2021-03-25 00:00:00','2021-03-25 00:00:00',?,'?',?)",[req.body.data.name,req.body.data.name,req.body.data.price,req.body.data.id_categorie], function (err, result) {
      if (err){
         stuff["status"] = 400  
         stuff["status_message"] = "Product not inserted"
      }else{
         stuff["status"] = 200
         stuff["status_message"] = "Product inserted"
      }
      res.json(stuff)
   });
   
 });
   /*
                                    --- Supprimer le produit ---
   */ 
 app.delete('/api/delete/:id', (req, res, next) => {
  // test if req.params.name equal to _ALL , number , String
   stuff = {}

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
        

  //res.json({id : req.params.id})
 });
   /*
                                    --- Mettre à jour le produit ---
   */ 
 app.put('/api/update', (req, res, next) => {
    stuff = {}
/*
   http://www.codediesel.com/nodejs/mysql-transactions-in-nodejs/
*/
      db.query("update produits set prix = ? where id_produit = ? ",[req.body.data.value,req.body.data.id], (err, result) => {
         if (err){
            stuff["status"] = 400  
            stuff["status_message"] = "Product does not updated"
         }else{
            stuff["status"] = 200
            stuff["status_message"] = "Product was updated"
         }
      });
      db.query("insert into evolutions values (null,?,'2021-03-25 00:00:00',?)",[req.body.data.id,req.body.data.value], (err,result)=>{
         if(err){
            stuff["status"] = 400  
            stuff["status_message"] = "Product does not updated"
         }else{
            stuff["status"] = 200
            stuff["status_message"] = "Product was updated"
         }
         res.json(stuff)
      });
      
  });
/*
                           --- afficher les produits dans la page lecture et visualisation ---
*/
/**TODO 
 *  Ajouter la categorie de produit
 * **/
//////
//////
app.get('/api/name/:name', (req, res, next) => {
   var stuff = {}
    // test if req.params.name equal to _ALL , number , String
      if(req.params.name === '_ALL'){
         db.query("SELECT * from produits , categories where produits.categorie_produit = categories.id_categorie", function (err, result) {
            if (err){
               log.console(err)
              stuff["status"] = 400  
              stuff["status_message"] = "Product not Found"
            }else{
              stuff["status"] = 200
              stuff["status_message"] = "Product Found"
              stuff["data"] = result
            }
            res.json(stuff)
          });
      }else if(isNaN(req.params.name)){
         db.query("SELECT * from produits , categories where produits.categorie_produit = categories.id_categorie and nom like ?" ,[req.params.name], function (err, result) {
            if (err){
              stuff["status"] = 400  
              stuff["status_message"] = "Product not Found"
            }else{
              stuff["status"] = 200
              stuff["status_message"] = "Product Found"
              stuff["data"] = result
            }
            res.json(stuff)
          });
      }else{
         db.query("SELECT * from produits , categories where produits.categorie_produit = categories.id_categorie and id_produit = ? ",[req.params.name], function (err, result) {
            if (err){
               stuff["status"] = 400  
               stuff["status_message"] = "Product not Found"
            }else{
               stuff["status"] = 200
               stuff["status_message"] = "Product Found"
               stuff["data"] = result
            }
            res.json(stuff)
            });
      }

 });
 /*
                           --- envoyer liste categories ---
*/
/**TODO 
 *  Ajouter la categorie de produit
 * **/
//////
//////
app.get('/api/categorie', (req, res, next) => {
   var stuff = {}
    // test if req.params.name equal to _ALL , number , String
      db.query("SELECT * from categories", function (err, result) {
         if (err){
            log.console(err)
            stuff["status"] = 400  
            stuff["status_message"] = "Product not Found"
         }else{
            stuff["status"] = 200
            stuff["status_message"] = "Product Found"
            stuff["data"] = result
         }
         res.json(stuff)
         });
 });
/*
                              pour afficher la courbe, liste date et liste prix 
*/

/**TODO 
 *  Ajouter l'affichage de la categorie de produit
 * **/

app.get('/api/id/:name', (req,res,next) => {
      var stuff = {}

      let valueprix = [];
      
      let valuedate = []
      let evolutions = {}
      db.query("SELECT * FROM produits, evolutions, categories where evolutions.id_produit = produits.id_produit and produits.categorie_produit = categories.id_categorie and produits.id_produit = ? order by evolutions.date_up", [req.params.name], function(err, result){
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


module.exports = app;