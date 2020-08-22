const generateMessages = (username, text) => {
  return {
    username,
    text,
    createdAt: new Date().getTime(),
  };
};

const generateLocationMessages = (username, { latitude, longitude }) => {
  return {
    username,
    url: `http://google.com/maps?q=${latitude},${longitude}`,
    createdAt: new Date().getTime(),
  };
};

module.exports = {
  generateMessages,
  generateLocationMessages,
};
