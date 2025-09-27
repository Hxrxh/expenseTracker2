async function handleFormSubmit(event) {
  try {
    event.preventDefault();
    console.log("handle form subnmit called");
    const userDetails = {
      name: event.target.name.value,
      email: event.target.email.value,
      password: event.target.password.value,
    };
    console.log(userDetails);
    const response = await axios.post(
      "http://localhost:3000/user/signup",
      userDetails
    );
    console.log(response);
    // displayItemsOnScreen(response.data);
    event.target.reset();
  } catch (err) {
    console.log(err);
  }
}

module.exports = handleFormSubmit;
