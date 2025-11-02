const userLocalStorageDetails = localStorage.getItem("userDetails");
const userDetails = JSON.parse(userLocalStorageDetails);
console.log(userDetails);
const ticketId = Math.floor(Math.random() * 10**5);

document.querySelector(".ticket-user-fullname").innerHTML =
  userDetails.fullNameInput;
document.querySelector(".ticket-github-username").innerHTML =
  userDetails.githubUsernameInput;
document.querySelector("#fullname").innerHTML = userDetails.fullNameInput;
document.querySelector("#email").innerHTML = userDetails.emailInput;
document.querySelector(".ticket-id").innerHTML = "#" + ticketId;
document.querySelector("#ticket-avatar").src = userDetails.fileInput.dataURL;