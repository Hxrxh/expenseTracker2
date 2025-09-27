// async function handleFormSubmit(event) {
//   try {
//     event.preventDefault();
//     console.log("handle form subnmit called");
//     const userDetails = {
//       name: event.target.userName.value,
//       email: event.target.email.value,
//       password: event.target.password.value,
//     };
//     console.log(userDetails);
//     const response = await axios.post(
//       "http://localhost:3000/user/signup",
//       userDetails
//     );
//     console.log(response);
//     // displayItemsOnScreen(response.data);
//     event.target.reset();
//   } catch (err) {
//     console.log(err);
//   }
// }
const errorBox = document.querySelector(".error-box");
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
    console.log(response);
    errorBox.textContent = "";
    alert(response.data);
    // displayItemsOnScreen(response.data);
    event.target.reset();
  } catch (err) {
    if (err.response) {
      errorBox.textContent = err.response.data;
    } else {
      errorBox.textContent = "Something went wrong. Try again.";
    }
    console.log(err);
  }
}
module.exports = handleFormSubmit;
