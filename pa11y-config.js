const credentials = 'kevin:50625062';
// eslint-disable-next-line no-buffer-constructor
const encodedCredentials = new Buffer(credentials).toString('base64');

module.exports = {
  defaults: {
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
    },
    timeout: 10000,
  },
};
