//file system
const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./starter/modules/replaceTemplate');

////server

const tempOverview = fs.readFileSync(
  'starter/templates/template-overview.html',
  'utf-8'
);
const tempCard = fs.readFileSync(
  'starter/templates/template-card.html',
  'utf-8'
);
const tempProduct = fs.readFileSync(
  'starter/templates/template-product.html',
  'utf-8'
);
const data = fs.readFileSync('starter/dev-data/data.json', 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //Overview Page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html'
    });
    //el hold elements
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output);
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }
  //
  else if (pathname === '/api') {
    //API page
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);
  }
  //
  else {
    //Error 404 Page
    res.writeHead(404, {
      'Content-type': 'text/html'
    });
    res.end('<h1 >Error Page not Found</h1>');
  }
});

const PORT = 8000;
server.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running on ${PORT}...`);
});
