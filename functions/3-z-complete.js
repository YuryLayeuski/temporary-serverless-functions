require('dotenv').config()
const Airtable = require('airtable-node');

const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base('app0H8E7bm7FxkLyl')
  .table('products')

// domain/.netlify/functions/3-product
exports.handler = async(event, context) => {
  // get an id from url
  const { id } = event.queryStringParameters;
  // if id exists
  if(id) {
    try {
      // get the product from airtable with an id
      const product = await airtable.retrieve(id)
      // if airtable return error
      if(product.error){
        return {
          statusCode: 404,
          body: `No product with id: ${id}`,
        }
      }
      // return product
      return {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        statusCode: 200,
        body: JSON.stringify(product),
      }
    }catch(error){
      return {
        statusCode: 500,
        body: `Server Error`,
      }
    }
  }
  try {
    const { records } = await airtable.list();
    const products = records.map((product) => {
      const { id } = product;
      const { name, image, price } = product.fields;
      const url = image[0].url;
      return {id, name, url, price};
    });
    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      statusCode: 200,
      body: JSON.stringify(products),
    }
  } catch(error){
    return {
      statusCode: 500,
      body: 'Server Error'
    }
  }
}