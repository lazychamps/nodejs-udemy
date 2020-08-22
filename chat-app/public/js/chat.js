const socket = io();

const $messageForm = document.querySelector("#message-form");
const $inputField = document.querySelector("[name='message']");
const $submitButton = document.querySelector("#save-btn");
const $locationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

const messageTemplate = document.querySelector("#message-template").innerHTML;

socket.on("message", (message) => {
  console.log({ message });
  const html = Mustache.render(messageTemplate, { message });
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
