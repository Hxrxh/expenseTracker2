document.addEventListener("DOMContentLoaded", async () => {
  try {
    let token = localStorage.getItem("token");
    // If arriving from payment redirect, we may have status params
    const url = new URL(window.location.href);
    const paymentStatus = url.searchParams.get("status");
    const orderId = url.searchParams.get("orderId");
    if (paymentStatus) {
      const banner = document.createElement("div");
      banner.style.padding = "10px";
      banner.style.margin = "10px";
      banner.style.borderRadius = "6px";
      banner.style.color = "#0b1";
      banner.style.background = paymentStatus === "Success" ? "#e8f9ef" : paymentStatus === "Pending" ? "#fff8e1" : "#fdecea";
      banner.style.color = paymentStatus === "Success" ? "#256029" : paymentStatus === "Pending" ? "#8a6d3b" : "#a94442";
      banner.textContent = `Payment ${paymentStatus}${orderId ? ` (Order ${orderId})` : ""}`;
      document.body.prepend(banner);
      // Optionally clean the query params
      window.history.replaceState({}, document.title, "/expense.html");
    }
    const res = await axios.get("http://localhost:3000/expense", {
      headers: { Authorization: token },
    });

    for (let i = 0; i < res.data.length; i++) {
      displayExpenseOnScreen(res.data[i]);
    }
  } catch (err) {
    console.log(err);
  }
});

async function handleExpenseForm(event) {
  try {
    event.preventDefault();
    console.log("handle form subnmit called");

    const expenseDetails = {
      amount: event.target.amount.value,
      desc: event.target.desc.value,
      category: event.target.category.value,
    };
    const token = localStorage.getItem("token");
    const response = await axios.post(
      "http://localhost:3000/expense",
      expenseDetails,
      {
        headers: { Authorization: token },
      }
    );
    console.log(response.data);
    displayExpenseOnScreen(response.data);
    event.target.reset();
  } catch (err) {
    console.log(err);
  }
}

function displayExpenseOnScreen(expenseDetails) {
  const expenseLi = document.createElement("li");
  expenseLi.dataset.id = expenseDetails.id;
  const textSpan = document.createElement("span");
  textSpan.textContent = `${expenseDetails.expenseamount} - ${expenseDetails.description} - ${expenseDetails.category}`;
  expenseLi.appendChild(textSpan);

  const deleteBtn = document.createElement("button");
  deleteBtn.appendChild(document.createTextNode("Delete"));
  expenseLi.appendChild(deleteBtn);
  const expenseList = document.querySelector("ul");
  expenseList.appendChild(expenseLi);

  deleteBtn.addEventListener("click", () => {
    deleteExpenseData(expenseDetails.id, expenseLi);
  });
}

async function deleteExpenseData(id, li) {
  try {
    console.log("deleteExpenseData called.");
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:3000/expense/${id}`, {
      headers: { Authorization: token },
    });

    li.remove();
  } catch (err) {
    console.log(err);
  }
}
// Do not touch code below
module.exports = handleExpenseForm;
