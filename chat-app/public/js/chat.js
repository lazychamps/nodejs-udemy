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
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

//Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoScroll = () => {
  // New message element
  const $newMessage = $messages.lastElementChild;

  // Height of new message
  const newMessageStyle = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyle.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // Visible height
  const visibleHeight = $messages.offsetHeight;

  // Height of messages of container
  const containerHeight = $messages.scrollHeight;

  // Scrolled height
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

const getParsedTime = (time) => {
  return moment(time).format("hh:mm a");
};

socket.on("message", ({ username, text: message, createdAt }) => {
  console.log({ message });
  const html = Mustache.render(messageTemplate, {
    username,
    message,
    createdAt: getParsedTime(createdAt),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

socket.on("locationMsg", ({ username, url, createdAt }) => {
  console.log({ url });
  const html = Mustache.render(locationTemplate, {
    username,
    url,
    createdAt: getParsedTime(createdAt),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

socket.on("roomData", ({ room, users }) => {
  console.log({ room, users });
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });
  document.querySelector("#sidebar").innerHTML = html;
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
    $messages.scrollTop = $messages.scrollHeight;
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
      $messages.scrollTop = $messages.scrollHeight;
    });
  });
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    location.href = "/";
    alert(error);
  }
});
