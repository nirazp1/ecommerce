const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({ host: 'localhost:9200' });

exports.searchProducts = async (req, res) => {
  try {
    const { query, category, minPrice, maxPrice, supplier } = req.query;
    
    let body = {
      query: {
        bool: {
          must: [
            { multi_match: { query, fields: ['name', 'description'] } }
          ],
          filter: []
        }
      }
    };

    if (category) body.query.bool.filter.push({ term: { category } });
    if (supplier) body.query.bool.filter.push({ term: { supplierId: supplier } });
    if (minPrice || maxPrice) {
      body.query.bool.filter.push({
        range: {
          price: {
            gte: minPrice,
            lte: maxPrice
          }
        }
      });
    }

    const result = await client.search({
      index: 'products',
      body: body
    });

    res.json(result.hits.hits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
