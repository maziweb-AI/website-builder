const ShopifyConverter = require('./shopify/converter');
const StaticConverter = require('./static/converter');

// Plus tard: WordPressConverter

function getConverter(platform) {
  switch (platform) {
    case 'shopify':
      return new ShopifyConverter();
    case 'static':
      return new StaticConverter();
    default:
      throw new Error('Unsupported platform: ' + platform);
  }
}

module.exports = { getConverter };
