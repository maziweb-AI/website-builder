const ShopifyConverter = require('./shopify/converter');

// Plus tard on ajoutera WordPress et Static ici

function getConverter(platform) {
  switch (platform) {
    case 'shopify':
      return new ShopifyConverter();
    default:
      throw new Error('Unsupported platform: ' + platform);
  }
}

module.exports = { getConverter };
