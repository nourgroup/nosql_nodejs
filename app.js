
//const bodyParser = require('body-parser');
const mysql = require('mysql');
var dateFormat = require('dateformat');

var deuxDB= true;
 var db = mysql.createConnection({
   host: "localhost",
   user: "root",
   password: "",
   database : "projet_nosql"
});

db.connect(function(err) {
   if(err){
      deuxDB = false
      console.log("db error")
   }else{
      console.log("db succes")
   }
})

const express = require('express')
const app = express()
app.use(express.json());
/**
 *                      Import MongoClient & connexion à la DB
 */
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'projet_nosql';
let dbm

MongoClient.connect(url, {useUnifiedTopology: true}, function(err, client) {
  if(err){
   deuxDB = false
    console.log("not connected to the server");
  }else{
    console.log("Connected successfully to server");
    dbm = client.db(dbName);
  }
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
if(deuxDB){
   app.listen(4000, () => {
      console.log("listen");
    })
}
/**
                              --1-inserer un produit et le mettre dans l'evolution---
*/ 

/**TODO 
 *  recevoir le numero de la categorie
 * **/

/*
                                          --- Mysql ---- ok
*/
var day=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
/*
app.post('/api/add', (req, res, next) => {
   var stuff = {}
   db.query("insert into categories values (?,?)",[parseInt(req.body.data.categorie.id_categorie),req.body.data.categorie.nom_categorie], function (err, result) {
      if (err){
         stuff["status"] = 400  
         stuff["status_message"] = "Product not inserted"
      }else{
         stuff["status"] = 200
         stuff["status_message"] = "Product inserted"
      }
   });
   db.query("insert into produits values (null,?,?,?,?,'?',?)",[req.body.data.name,day,day,req.body.data.description,req.body.data.price,req.body.data.categorie.id_categorie], function (err, result) {
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
                                          --- MongoDB --- ok
*/

app.post('/api/add', (req, res, next) => {
   var stuff = {}
   const produit = {
      'nom' : req.body.data.name,
      'date_in': day,
      'date_up': day,
      'description': req.body.data.description,
      'prix': req.body.data.price,
      'categorie':{
         'id_categorie' : parseInt(req.body.data.categorie.id_categorie),
         'nom_categorie': req.body.data.categorie.nom_categorie
      },
      'evolution': [
         {
            'date_up': day,
            'prix': req.body.data.price
         }
      ]
   }
   dbm.collection('produit').insertOne(produit, (err,info) => {
      if(err){
         stuff["status"] = 400
         stuff["status_message"] = "Product Not updated"
         stuff["data"] = null
      }else{
         stuff["status"] = 200
         stuff["status_message"] = "Product was updated"
         stuff["data"] = info
      }
      res.json(stuff)
   })
});

/*
                                 --2- Supprimer un produit ---
*/ 

/*
                                          --- Mysql ---- ok
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
                                          --- MongoDB --- ok
 */

var ObjectId = require('mongodb').ObjectID;

app.delete('/api/delete/:id', (req, res, next) => {
   dbm.collection('produit').remove({'_id' : ObjectId(req.params.id)})
   res.json({'response':req.params.id})
});


/*
                                 --3- Mettre à jour le prix du produit et l'inserer dans l'évolution---
*/ 
/*
http://www.codediesel.com/nodejs/mysql-transactions-in-nodejs/
                                       --- Mysql --- ok
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
                                          --- Mongodb ---- ok
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
                                          --- Mysql ---- ko recherche
*/

/** 
 *                               TODO problème dans la recherche SQL mongodb
 * **/
/*
app.get('/api/name/:name', (req, res, next) => {
   var stuff = {}
      if(req.params.name === '_ALL'){
         db.query("SELECT * from produits , categories where produits.categorie_produit = categories.id_categorie", function (err, result) {
            if (err){
               log.console(err)
               stuff["status"] = 400  
               stuff["status_message"] = "Product not Found"
            }else{
               result.forEach(element => {
                  element['categorie'] = {'id_categorie' : element['id_categorie'], 'nom_categorie':element['nom_categorie']} 
                  delete element['id_categorie']
                  delete element['nom_categorie']
               });
               stuff["status"] = 200
               stuff["status_message"] = "Product Found"
               stuff["data"] = result
            }
            res.json(stuff)
          });
      }else if(isNaN(req.params.name)){
         db.query("SELECT * from produits , categories where produits.categorie_produit = categories.id_categorie and nom like '%"+req.params.name+"%'" , function (err, result) {
            if (err){
              stuff["status"] = 400  
              stuff["status_message"] = "Product not Found"
            }else{
              stuff["status"] = 200
              stuff["status_message"] = "Product Found"
              result.forEach(element => {
                  element['categorie'] = {'id_categorie' : element['id_categorie'], 'nom_categorie':element['nom_categorie']} 
                  delete element['id_categorie']
                  delete element['nom_categorie']
               });
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
                                          --- Mongodb ---- ko recherche
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
      .toArray( (err, items) => {
         if(err){
            stuff["status"] = 400
            stuff["status_message"] = "Product Not Found"
            stuff["data"] = null
         }else{
            stuff["status"] = 200
            stuff["status_message"] = "Product Found"
            items.forEach(element => {
               element['id_produit']      = element['_id']
               element['nom_categorie']   = element['nom_categorie']
               delete element["_id"]
               allelement.push(element)
            });
            stuff["data"] = allelement
         }
         res.json(stuff)
      })
   }else if(isNaN(req.params.name)){
      dbm.collection('produit').find({nom:{$regex : '^'+req.params.name, '$options' : 'i'}})
      .toArray( (err, items) => {
         if(err){
            stuff["status"] = 400
            stuff["status_message"] = "Product Not Found"
            stuff["data"] = null
         }else{
            stuff["status"] = 200
            stuff["status_message"] = "Product Found"
            stuff["data"] = items
         }
         res.json(stuff)
      })
   }else{
      dbm.collection('produit').find({'_id': ObjectId(req.params.name)})
      .toArray( (err, items) => {
         stuff["status"] = 200
         stuff["status_message"] = "Product Found"
         stuff["data"] = items
         res.json(stuff)
      })
   }
});

/*
                               --5- Afficher la liste categories ---
*/
/** TODO 
 *  Ajouter la categorie de produit
 * **/

/**
                                          --- Mysql ---- ok
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
                                          --- Mongodb ---- ok
**/

app.get('/api/categorie', (req, res, next) => {
   stuff = {}
   var a = dbm.collection('produit').distinct('categorie')
   .then(results => {
      stuff["status"] = 200
      stuff["status_message"] = "Product Found"
      stuff["data"] = results
      res.json(stuff)
  }).catch(err => {
      stuff["status"] = 400
      stuff["status_message"] = "Product Not Found"
      stuff["data"] = null
      //stuff["data"] = err
  })
});

/*
                        --6- afficher la liste (date et prix) pour la courbe coté client API---
*/

/**
                                          --- Mysql ---- ok
**/

/**TODO 
 *  Ajouter l'affichage de la categorie de produit
 * **/
/*
app.get('/api/id/:name', (req,res,next) => {
      let valueprix = []
      var stuff = {}

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
         //TODO
         evolutions =   {"evolutions" : {
                           "date" :valuedate, 
                           "prix" :  valueprix
                           },
                           "nom" : result[0].nom
                        }

         stuff["data"] = evolutions
         
         res.json(stuff)
      });
});
*/

/**
                                          --- Mongodb ---- ok
**/

app.get('/api/id/:name', (req, res, next) => {
   let valueprix = []   
   let valuedate = []
   let nom 

   var stuff = {}
   var allelement = []
   dbm.collection('produit').find({'_id' : ObjectId(req.params.name)})
   .toArray(function (err, items) {
         if(err){
            stuff["status"] = 400
            stuff["status_message"] = "Product not Found"
            stuff["data"] = null
            res.json(stuff)
         }else{
            items.forEach(el => {
               allelement.push(el['evolution'])
               nom = el['nom']
            })
            for(let i=0 ;i < allelement[0].length ; i ++ ){
               valueprix.push(allelement[0][i].prix)
               valuedate.push(allelement[0][i].date_up)
            }
         
            evolutions =   {"evolutions" : {
                              "date" :valuedate, 
                              "prix" :  valueprix
                              },
                              "nom" : nom
                           }
            
            stuff["status"] = 200
            stuff["status_message"] = "Product Found"
            stuff["data"] = evolutions
            
            res.json(stuff)
      }
   })
});


module.exports = app;