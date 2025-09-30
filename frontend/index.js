const errorBox = document.querySelector(".error-box");

function togglePages(path) {
  console.log("toggles");
  window.location.href = `${path}.html`; // Redirect to page2
}
async function handleFormSignUp(event) {
  try {
    event.preventDefault();
    console.log("handle form signup called");
    const userDetails = {
      name: event.target.userName.value,
      email: event.target.email.value,
      password: event.target.password.value,
    };
    console.log(userDetails);
    const response = await axios.post(
      "http://localhost:3000/user/signup",
      userDetails
    );
    console.log(response);
    errorBox.textContent = "";
    alert(response.data.message);
    // displayItemsOnScreen(response.data);
    event.target.reset();
  } catch (err) {
    console.log(err.response);
    if (err.response) {
      errorBox.textContent = err.response.data.message;
    } else {
      errorBox.textContent = "Something went wrong. Try again.";
    }
  }
}

async function handleFormSubmit(event) {
  try {
    event.preventDefault();
    console.log("handle form subnmit called");
    const userDetails = {
      email: event.target.email.value,
      password: event.target.password.value,
    };
    console.log(userDetails);
    const response = await axios.post(
      "http://localhost:3000/user/login",
      userDetails
    );
    // console.log(response.data.message, response.data.token);
    console.log(response.data.token)
    localStorage.setItem("token", response.data.token);
    errorBox.textContent = "";

    window.location.href = "expense.html";
    // displayItemsOnScreen(response.data);
    event.target.reset();
  } catch (err) {
    console.log(err.response.data.message);
    if (err.response) {
      errorBox.textContent = err.response.data.message;
    } else {
      errorBox.textContent = "Something went wrong. Try again.";
    }
  }
}
module.exports = { handleFormSignUp, handleFormSubmit, togglePages };
s;
