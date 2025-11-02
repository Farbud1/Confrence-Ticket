const dragAndDropZone = document.querySelector(".drag-and-drop-zone");
const fileInput = document.querySelector("#avatar");
const uploadIcon = document.querySelector(".upload-icon");
const uploadText = document.querySelector(".upload-text");
const fullNameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const githubUsernameInput = document.querySelector("#github");
const generateButton = document.querySelector("#generate-button");

// Store the data URL when file is processed
let fileDataURL = null;

// Prevent default drag behaviors
dragAndDropZone.addEventListener("dragover", handleDragOver);
dragAndDropZone.addEventListener("dragleave", handleDragLeave);
dragAndDropZone.addEventListener("drop", handleDrop);

// Allow clicking on the zone to trigger file input
dragAndDropZone.addEventListener("click", () => {
  fileInput.click();
});

// Handle file input change (when user selects file via click)
fileInput.addEventListener("change", handleFileSelect);

// Handle generate button click
generateButton.addEventListener("click", handleGenerateClick);

function handleDragOver(event) {
  event.preventDefault();
  event.stopPropagation();
  dragAndDropZone.classList.add("drag-over");
}

function handleDragLeave(event) {
  event.preventDefault();
  event.stopPropagation();
  dragAndDropZone.classList.remove("drag-over");
}

function handleDrop(event) {
  event.preventDefault();
  event.stopPropagation();
  dragAndDropZone.classList.remove("drag-over");

  const files = event.dataTransfer.files;
  if (files.length > 0) {
    processFile(files[0]);
  }
}

function handleFileSelect(event) {
  const files = event.target.files;
  if (files.length > 0) {
    processFile(files[0]);
  }
}

function isValidImageFile(file) {
  const validTypes = ["image/jpeg", "image/jpg", "image/png"];
  return validTypes.includes(file.type.toLowerCase());
}

function processFile(file) {
  // Validate file type
  if (!isValidImageFile(file)) {
    alert("Please select a JPG or PNG image file.");
    fileInput.value = ""; // Reset the input
    fileDataURL = null; // Reset data URL
    return;
  }

  // Validate file size (500kb max as mentioned in HTML)
  const maxSize = 500 * 1024; // 500KB in bytes
  if (file.size > maxSize) {
    alert("File size must be less than 500KB.");
    fileInput.value = ""; // Reset the input
    fileDataURL = null; // Reset data URL
    return;
  }

  // Create FileList with the selected file and assign to input
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
  fileInput.files = dataTransfer.files;

  // Display the image and store the data URL
  displayImage(file);
}

function displayImage(file) {
  // Remove existing preview image if any
  const existingPreview = dragAndDropZone.querySelector(".image-preview");
  if (existingPreview) {
    existingPreview.remove();
  }

  // Create image preview
  const reader = new FileReader();
  reader.onload = function (e) {
    // Store the data URL for later use
    fileDataURL = e.target.result;

    // Hide upload icon and text
    if (uploadIcon) uploadIcon.style.display = "none";
    if (uploadText) uploadText.style.display = "none";

    // Create and display image preview
    const img = document.createElement("img");
    img.src = e.target.result;
    img.className = "image-preview";
    img.style.maxWidth = "100%";
    img.style.maxHeight = "200px";
    img.style.objectFit = "contain";
    img.style.borderRadius = "4px";
    dragAndDropZone.appendChild(img);
  };
  reader.readAsDataURL(file);
}

// Validation functions
function validateFullName(name) {
  if (!name || name.trim().length === 0) {
    return "Full name is required";
  }
  if (name.trim().length < 5) {
    return "Full name must be at least 5 characters";
  }
  return null;
}

function validateEmail(email) {
  if (!email || email.trim().length === 0) {
    return "Email is required";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  return null;
}

function validateGithubUsername(username) {
  if (!username || username.trim().length === 0) {
    return "GitHub username is required";
  }
  // Remove @ if user includes it
  const cleanUsername = username.replace(/^@/, "");
  if (cleanUsername.length < 1) {
    return "Please enter a valid GitHub username";
  }
  return null;
}

function validateFile(file) {
  if (!file) {
    return "Please upload an avatar image";
  }
  // File validation is already done in processFile
  return null;
}

// Main validation and object creation function
function handleGenerateClick(event) {
  event.preventDefault();

  // Get current file from input
  const currentFile =
    fileInput.files && fileInput.files.length > 0 ? fileInput.files[0] : null;

  // Validate all inputs
  const fullNameError = validateFullName(fullNameInput.value);
  const emailError = validateEmail(emailInput.value);
  const githubError = validateGithubUsername(githubUsernameInput.value);
  const fileError = validateFile(currentFile);

  // Collect all errors
  const errors = [];
  if (fullNameError) errors.push(fullNameError);
  if (emailError) errors.push(emailError);
  if (githubError) errors.push(githubError);
  if (fileError) errors.push(fileError);

  // If there are errors, display them
  if (errors.length > 0) {
    alert("Please fix the following errors:\n\n" + errors.join("\n"));
    return;
  }

  // All validations passed, create the object
  const userDetails = {
    fileInput: {
      name: currentFile.name,
      size: currentFile.size,
      type: currentFile.type,
      lastModified: currentFile.lastModified,
      // Store the file as base64 for easy access
      dataURL: fileDataURL || null,
    },
    fullNameInput: fullNameInput.value.trim(),
    emailInput: emailInput.value.trim(),
    githubUsernameInput: githubUsernameInput.value.trim().replace(/^@/, ""),
  };

  // Log the object for debugging
  console.log("User Details Object:", userDetails);

  // TODO: Add functionality to pass this data to the ticket generation
  alert(
    "Ticket generation will be implemented here!\n\nDetails captured:\n" +
      `Name: ${userDetails.fullNameInput}\n` +
      `Email: ${userDetails.emailInput}\n` +
      `GitHub: @${userDetails.githubUsernameInput}\n` +
      `Avatar: ${userDetails.fileInput.name}`
  );

  localStorage.setItem("userDetails", JSON.stringify(userDetails));

  // Redirect to ticket page
  window.location.href = "../Ticket/index.html";
}
