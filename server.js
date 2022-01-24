require('dotenv').config();
const express = require('express');
const cors = require('cors');
var bodyparse = require('body-parser');
const dns = require('dns');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

let count = 0;
const shortUrls = {};

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.use(bodyparse.urlencoded({extended : false}));

app.post('/api/shorturl', function (req, res) {
  console.log(req.body.url);
  const url = req.body.url;
  try{
  const urlObject = new URL(url);
  console.log(urlObject.protocol);
  } catch(e) {
    res.send({ error: 'invalid url' });
    console.log('did i return?');
    return;
  }
  const urlObject = new URL(url);
  dns.lookup(urlObject.hostname, (err, address, family) => {
    console.log('err:' + err + " address: " + address + " family: " + family);
    if(err){
      console.log('error');
      res.send({ error: 'invalid url' });
      return;
    }
  });
  if(urlObject.protocol !== 'https:'){
    res.send({ error: 'invalid url' });
    return;
  }
  console.log('hmm no :)');
  shortUrls[count] = url;
  count += 1;
  console.log(shortUrls);
  res.send({ original_url: req.body.url, short_url: count-1});
});

app.get('/api/shorturl/:id', function(req, res) {
  const id = req.params.id;
  const url = shortUrls[id];
  res.redirect(url);
})
/*
app.route('/api/shorturl')
    .get(function(req, res){
      console.log(req);
      console.log(req.query.url);
      res.json({ "pussy": "bitch"});
    }).post(function(req,res){
      console.log(req.query);
      res.json({ "pussy": "bitch"});
    });

*/

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
