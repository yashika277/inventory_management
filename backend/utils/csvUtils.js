const { Parser } = require('json2csv');

exports.toCSV = (data) => {
  try {
    const fields = ['name', 'quantity', 'price', 'supplier.name', 'supplier.contactEmail', 'supplier.phoneNumber'];
    const opts = { fields, flatten: true };
    const parser = new Parser(opts);
    return parser.parse(data);
  } catch (err) {
    throw new Error('Error converting JSON to CSV: ' + err.message);
  }
};