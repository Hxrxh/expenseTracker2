document.addEventListener("DOMContentLoaded", async () => {
  try {
    let token = localStorage.getItem("token");

    checkPremium(token);

    const res = await axios.get("http://localhost:3000/transaction", {
      headers: { Authorization: token },
    });
    if (!res.data) {
      console.log("NO expense data");
    } else {
      for (let i = 0; i < res.data.length; i++) {
        displayTransactionOnScreen(res.data[i]);
      }
    }
  } catch (err) {
    console.log(err);
  }
});

async function handleTransactionForm(event) {
  try {
    event.preventDefault();
    console.log("handle form subnmit called");
    const prompt = { prompt: event.target.desc.value };
    console.log(prompt);
    const AicategoryResponse = await axios.post(
      "http://localhost:3000/getCategory",
      prompt
    );
    console.log(AicategoryResponse);
    const transactionDetails = {
      amount: event.target.amount.value,
      desc: event.target.desc.value,
      category: AicategoryResponse.data.category,
      type: event.target.type.value,
    };
    const token = localStorage.getItem("token");
    const response = await axios.post(
      "http://localhost:3000/transaction",
      transactionDetails,
      {
        headers: { Authorization: token },
      }
    );
    console.log(response.data);
    displayTransactionOnScreen(response.data);
    event.target.reset();
  } catch (err) {
    console.log(err);
  }
}
async function checkPremium(token) {
  try {
    console.log(token, "checkPremium Called");
    const res = await axios.get("http://localhost:3000/user/check-premium", {
      headers: { Authorization: token },
    });
    console.log(res.data, "checkPremium called");
    if (res.data.isPremium) {
      const premiumDiv = document.getElementById("premium-user");
      const heading = document.createElement("h2");
      heading.textContent = "You are a Premium User now!";
      premiumDiv.appendChild(heading);
      const buyBtn = document.getElementById("renderBtn");
      buyBtn.style.visibility = "hidden";
      const showLeaderboardButton = document.createElement("button");
      showLeaderboardButton.appendChild(
        document.createTextNode("show Leaderboard")
      );
      const downloadButton = document.createElement("button");
      downloadButton.appendChild(document.createTextNode("Download"));
      premiumDiv.appendChild(showLeaderboardButton);
      premiumDiv.appendChild(downloadButton);
      downloadButton.addEventListener("click", () => {
        downloadExpenses();
      });
      showLeaderboardButton.addEventListener("click", () => {
        showLeaderboard();
      });
    }
  } catch (error) {
    console.log(error);
  }
}

async function showLeaderboard() {
  try {
    const leaderboardContainer = document.getElementById("leaderboard");
    leaderboardContainer.innerHTML = "";
    const leaderboardData = await axios.get(
      "http://localhost:3000/premium/leaderboard"
    );
    console.log(leaderboardData);
    const userInfo = leaderboardData.data.userTotalExpense;

    for (let i = 0; i < userInfo.length; i++) {
      const textSpan = document.createElement("li");
      textSpan.textContent = `Name - ${userInfo[i].name} - TotalExpense - ${userInfo[i].totalExpense}`;
      leaderboardContainer.appendChild(textSpan);
    }
  } catch (error) {
    console.log(error.message);
  }
}
function displayTransactionOnScreen(expenseDetails) {
  const expenseLi = document.createElement("li");
  expenseLi.dataset.id = expenseDetails.id;
  const textSpan = document.createElement("span");
  textSpan.textContent = `${expenseDetails.expenseamount} - ${expenseDetails.description} - ${expenseDetails.category}`;
  expenseLi.appendChild(textSpan);

  const deleteBtn = document.createElement("button");
  deleteBtn.appendChild(document.createTextNode("Delete"));
  expenseLi.appendChild(deleteBtn);
  const expenseList = document.getElementById("expenseList");
  expenseList.appendChild(expenseLi);

  deleteBtn.addEventListener("click", () => {
    deleteExpenseData(expenseDetails.id, expenseLi);
  });
}

async function deleteExpenseData(id, li) {
  try {
    console.log("deleteExpenseData called.");
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:3000/transaction/${id}`, {
      headers: { Authorization: token },
    });

    li.remove();
  } catch (err) {
    console.log(err);
  }
}

async function downloadExpenses() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:3000/user/download", {
      headers: { Authorization: token },
    });
    if (response.status === 201) {
      var a = document.createElement("a");
      a.href = response.data.fileUrl;
      a.download = "myexpense.csv";
      a.click();
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.log(error.message);
  }
}
// Do not touch code below
