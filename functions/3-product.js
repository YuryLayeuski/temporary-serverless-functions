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
  // if no id inside the url
  return {
    statusCode: 400,
    body: 'Please provide product id',
  }
}