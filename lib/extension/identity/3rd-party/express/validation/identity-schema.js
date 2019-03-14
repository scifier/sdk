module.exports = {
  providerId: {
    errorMessage: 'INVALID_PROVIDER_ID',
    isLength: {
      options: { min: 1 },
    },
  },
  uid: {
    errorMessage: 'INVALID_USER_ID',
    isLength: {
      options: { min: 1 },
    },
  },
  address: {
    errorMessage: 'INVALID_ADDRESS',
    isLength: {
      options: { min: 1 },
    },
  },
  'connection.secret': {
    errorMessage: 'INVALID_CONNECTION_SECRET',
    isLength: {
      options: { min: 1 },
    },
  },
  'connection.cbEndpoint': {
    errorMessage: 'INVALID_CONNECTION_CALLBACK_ENDPOINT',
    optional: true,
  },
};
