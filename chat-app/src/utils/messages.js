const generateMessages = (text) => {
  return {
    text,
    createdAt: new Date().getTime(),
  };
};

const generateLocationMessages = ({ latitude, longitude }) => {
  return {
    url: `http://google.com/maps?q=${latitude},${longitude}`,
    createdAt: new Date().getTime(),
  };
};

module.exports = {
  generateMessages,
  generateLocationMessages,
};
