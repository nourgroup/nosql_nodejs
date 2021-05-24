//const express = require('express');
//const bodyParser = require('body-parser');
const mysql = require('mysql');
var dateFormat = require('dateformat');

//const app = express();
//app.use(express.json())    // <==== parse request body as JSON


/*app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
   next();
 });
*/
 var db = mysql.createConnection({
   host: "localhost",
   user: "root",
   password: "",
   database : "projet_nosql"
});
/*
db.connect(function(err) {
   if(err){
      console.log("db error")
   }else{
      console.log("db succes")
      app.listen(4000, () => {
         console.log("listen");
      })
   }
})
*/
const express = require('express')
const app = express()
//app.use(express.json())
/**
 *                      Import MongoClient & connexion à la DB
 */
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'projet_nosql';
let dbm

app.use(express.json());


MongoClient.connect(url, {useUnifiedTopology: true}, function(err, client) {
  if(err){
    console.log("not connected to the server");
  }else{
    console.log("Connected successfully to server");
    dbm = client.db(dbName);
    app.listen(4000, () => {
      console.log("listen");
    })
  }
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
/**
                                 --1-inserer un produit---
*/ 

/**TODO 
 *  recevoir le numero de la categorie
 * **/

/*
                                          --- Mysql ----
*/
var day=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
/*
app.post('/api/add', (req, res, next) => {
   var stuff = {}
   db.query("insert into produits values (null,?,?,?,?,'?',?)",[req.body.data.name,day,day,req.body.data.name,req.body.data.price,req.body.data.id_categorie], function (err, result) {
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
*/

/*
                                          --- MongoDB ---
*/

app.post('/api/add', (req, res, next) => {
   /*
   const produit = {
      'nom' : req.body.data.name,
      'date_in': day,
      'date_up': day,
      'description': req.body.data.name,
      'prix': req.body.data.price,
         'categorie':{
            'nom_categorie': req.body.data.name
         }
   }
   dbm.collection('produit').insertOne(produit, function (
      err,
      info
   ){
      res.json(info.ops[0])
   })
   */
});

/*
                                 --2- Supprimer un produit ---
*/ 

/*
                                          --- Mysql ----
*/

/*
app.delete('/api/delete/:id', (req, res, next) => {
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
});
*/
 /*
                                          --- MongoDB ---
 */

var ObjectId = require('mongodb').ObjectID;

 app.delete('/api/delete/:id', (req, res, next) => {
   dbm.collection('produit').remove({'_id' : ObjectId(req.params.id)})
   res.json({'response':req.params.id})
});


/*
                                 --3- Mettre à jour le prix du produit et inserer dans l'évolution---
*/ 
/*
http://www.codediesel.com/nodejs/mysql-transactions-in-nodejs/
                                       --- Mysql ---
*/
/*
app.put('/api/update', (req, res, next) => {
   stuff = {}

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
*/

/*
                                          --- Mongodb ----
*/


app.put('/api/update', (req, res, next) => {
   stuff = {}
   dbm.collection('produit').update({'_id' : ObjectId(req.body.data.id)},{$set: {'prix': parseInt(req.body.data.value)}})
   var a = {'prix':req.body.data.value,'date_up':day}
   dbm.collection('produit').update({'_id' : ObjectId(req.body.data.id)},{$push: {'evolution': a}})
   stuff["status"] = 200  
   stuff["status_message"] = "Product does not updated"
   res.json(stuff)
});


/*
                           --4- Afficher les produits dans la page lecture et visualisation ---
*/
/*
                                          --- Mysql ----
*/

/** 
 *                               TODO problème dans la recherche SQL mongodb
 * **/
/*
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
*/
/*
                                          --- Mongodb ----
*/
/*
   p1 : id_produit : mysql et _id mongodb
*/


app.get('/api/name/:name', (req, res, next) => {
   var stuff = {}
   var i = 0
   var allelement = []
   if(req.params.name === '_ALL'){
      dbm.collection('produit').find()
      .toArray(function (err, items) {
         stuff["status"] = 200
         stuff["status_message"] = "Product Found"
         items.forEach(element => {
            element['id_produit']      = element['_id']
            element['nom_categorie']   = element['nom_categorie']
            delete element["_id"]
            allelement.push(element)
         });
         stuff["data"] = allelement
         res.json(stuff)
      })
   }else if(isNaN(req.params.name)){
      dbm.collection('produit').find({'_id': ObjectId(req.params.name)})
      .toArray(function (err, items) {
         stuff["status"] = 200
         stuff["status_message"] = "Product Found"
         stuff["data"] = items
         res.json(stuff)
      })
   }else{
      
   }
 });


/*
                               --5- Envoyer liste categories ---
*/
/** TODO 
 *  Ajouter la categorie de produit
 * **/

/**
                                          --- Mysql ----
**/
/*
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
*/

/**
                                          --- Mongodb ----
**/

app.get('/api/categorie', (req, res, next) => {
   stuff = {}
   var a = dbm.collection('produit').distinct('prix')
   stuff["status"] = 200
   stuff["status_message"] = "Product Found"
   stuff["data"] = a
   res.json(stuff) 
});

/*
                        --6- pour afficher la courbe, liste date et liste prix ---
*/
/**
                                          --- Mysql ----
**/

/**TODO 
 *  Ajouter l'affichage de la categorie de produit
 * **/

/*
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
*/
/**
                                          --- Mongodb ----
**/

app.get('/api/id/:name', (req, res, next) => {
   let valueprix = [];   
   let valuedate = []

   var stuff = {}
   var allelement = []
   dbm.collection('produit').find({'_id' : ObjectId(req.params.name)})
   .toArray(function (err, items) {
      
      // adapter _id mongodb avec id_produit que le client API attend
      /*items.forEach(element => {
         element['id_produit'] = element['_id']
         delete element["_id"]
         allelement.push(element)
      });*/

      items.forEach(el => {
         allelement.push(el['evolution'])
      })
      for(let i=0 ;i < allelement[0].length ; i ++ ){
         valueprix.push(allelement[0][i].prix)
         valuedate.push(allelement[0][i].date_up)
      }
      
      evolutions = {"evolutions" : {"date" :valuedate, "prix" :  valueprix}}
      
      stuff["status"] = 200
      stuff["status_message"] = "Product Found"
      stuff["data"] = evolutions
      
      res.json(stuff)
   })
});


module.exports = app;