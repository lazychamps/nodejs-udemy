const socket = io();

//Elements
const $messageForm = document.querySelector("#message-form");
const $inputField = document.querySelector("[name='message']");
const $submitButton = document.querySelector("#save-btn");
const $locationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

//Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;

//Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const getParsedTime = (time) => {
  return moment(time).format("hh:mm a");
};

socket.on("message", ({ text: message, createdAt }) => {
  console.log({ message });
  const html = Mustache.render(messageTemplate, {
    message,
    createdAt: getParsedTime(createdAt),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMsg", ({ url, createdAt }) => {
  console.log({ url });
  const html = Mustache.render(locationTemplate, {
    url,
    createdAt: getParsedTime(createdAt),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  $submitButton.setAttribute("disabled", "disabled");
  const message = $inputField.value;
  socket.emit("sendMessage", message, (error) => {
    $submitButton.removeAttribute("disabled");
    $inputField.value = "";
    $inputField.focus();
    if (error) {
      return console.log(error);
    }
    console.log("Message has been delivered");
  });
});

$locationButton.addEventListener("click", (e) => {
  if (!navigator.geolocation) {
    return alert("Your browser does not support Geolocation");
  }
  $locationButton.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition(({ coords }) => {
    const { latitude, longitude } = coords;
    socket.emit("sendLocation", { latitude, longitude }, () => {
      $locationButton.removeAttribute("disabled");
      console.log("Location has been sent!!");
    });
  });
});

socket.emit("join", { username, room });
