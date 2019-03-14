module.exports.numberOrRange = {
  example(optionName) {
    return `(e.g. "${optionName} 1000" or "${optionName} 1000-1050")`;
  },
  options(opts) {
    return Object.assign({
      coerce(value) {
        let result = [];

        if (/^\d+\-\d+$/.test(value || '')) {
          const edges = value.split('-').map(n => parseInt(n)).sort();

          while (edges[0] <= edges[1]) {
            result.push(edges[0]);
            edges[0]++;
          }
        } else {
          result.push(value);
        }

        return result.map(n => parseInt(n));
      },
    }, opts);
  }
};
