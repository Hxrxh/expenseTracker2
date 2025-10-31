document.addEventListener("DOMContentLoaded", async () => {
  try {
    let token = localStorage.getItem("token");
    checkPremium(token);

    setupLimitSelector();

    let selectedLimit = localStorage.getItem("selectedLimit") || 5;
    console.log(selectedLimit);
    loadTransactions(1, selectedLimit);
  } catch (err) {
    console.log(err.message);
  }
});

function setupLimitSelector() {
  const paginationDiv = document.getElementById("pagination");

  const label = document.createElement("label");
  label.textContent = "Items per page: ";
  label.setAttribute("for", "limitSelect");

  const limitSelect = document.createElement("select");
  limitSelect.id = "limitSelect";

  [5, 10, 20].forEach((limit) => {
    const option = document.createElement("option");
    option.value = limit;
    option.textContent = limit;
    limitSelect.appendChild(option);
  });

  const savedLimit = localStorage.getItem("selectedLimit") || 5;
  limitSelect.value = savedLimit;

  limitSelect.addEventListener("change", () => {
    const selectedLimit = limitSelect.value;
    console.log(selectedLimit);
    localStorage.setItem("selectedLimit", selectedLimit);
    loadTransactions(1, selectedLimit); // reload from page 1
  });

  paginationDiv.appendChild(label);
  paginationDiv.appendChild(limitSelect);
}

async function loadTransactions(page, limit) {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `http://localhost:3000/transaction?page=${page}&limit=${limit}`,
      { headers: { Authorization: token } }
    );

    const expenseList = document.getElementById("expenseList");
    expenseList.innerHTML = "";

    const expenses = res.data.expenseData;
    expenses.forEach((expense) => {
      displayTransactionOnScreen(expense);
    });

    renderPagination(res.data);
  } catch (error) {
    console.log(error.message);
  }
}

async function renderPagination(paginationData) {
  try {
    const paginationDiv = document.getElementById("pagination");

    // clear old page buttons but keep label + select
    const existingSelect = document.getElementById("limitSelect");
    const label = paginationDiv.querySelector("label");
    paginationDiv.innerHTML = "";
    paginationDiv.appendChild(label);
    paginationDiv.appendChild(existingSelect);

    const totalPages = paginationData.totalPages;
    const currentPage = paginationData.currentPage;

    // Prev
    const prev = document.createElement("button");
    prev.textContent = "Prev";
    prev.disabled = currentPage === 1;
    prev.addEventListener("click", () => {
      const limit = localStorage.getItem("selectedLimit") || 5;
      loadTransactions(currentPage - 1, limit);
    });
    paginationDiv.appendChild(prev);

    // Page buttons
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    if (currentPage <= 2) endPage = Math.min(5, totalPages);
    if (currentPage >= totalPages - 1) startPage = Math.max(1, totalPages - 4);

    for (let i = startPage; i <= endPage; i++) {
      const pageBtn = document.createElement("button");
      pageBtn.textContent = i;
      pageBtn.disabled = i === currentPage;
      pageBtn.onclick = () => {
        const limit = localStorage.getItem("selectedLimit") || 5;
        loadTransactions(i, limit);
      };
      paginationDiv.appendChild(pageBtn);
    }

    // Next
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
      const limit = localStorage.getItem("selectedLimit") || 5;
      loadTransactions(currentPage + 1, limit);
    };
    paginationDiv.appendChild(nextBtn);
  } catch (error) {
    console.log(error.message);
  }
}
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
      note: event.target.notes.value,
    };

    console.log(event.target.notes.value);
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
      const premiumDiv = document.getElementById("premiumDiv");
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
      const expenseCategory = document.createElement("select");
      // expenseCategory.name = "filterSelect";
      ["Yearly", "Monthly", "Weekly"].forEach((period) => {
        const opt = document.createElement("option");
        opt.value = period.toLowerCase();
        opt.textContent = period;
        expenseCategory.appendChild(opt);
      });
      premiumDiv.appendChild(expenseCategory);
      expenseCategory.addEventListener("change", async (e) => {
        try {
          const filteredCategory = e.target.value;
          console.log(filteredCategory);
          const filterdData = await axios.get(
            `http://localhost:3000/transaction/filteredTransactions?type=${filteredCategory}`,
            {
              headers: { Authorization: token },
            }
          );

          displayFilteredTransactions(filterdData.data);
        } catch (error) {
          console.log(error.message);
        }
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
  textSpan.textContent = `${expenseDetails.expenseamount} - ${expenseDetails.description} - ${expenseDetails.category} `;
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
    const selectedLimit = localStorage.getItem("selectedLimit") || 5;
    await axios.delete(`http://localhost:3000/transaction/${id}`, {
      headers: { Authorization: token },
    });

    li.remove();
    loadTransactions(1, selectedLimit);
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

function displayFilteredTransactions(expenses) {
  const filteredList = document.getElementById("filteredExpense");
  filteredList.innerHTML = ""; // clear previous
  if (!expenses || expenses.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No transactions found for this period.";
    filteredList.appendChild(li);
    return;
  }

  const items = Array.isArray(expenses) ? expenses : [expenses];
  items.forEach((expenseDetails) => {
    const expenseLi = document.createElement("li");
    expenseLi.dataset.id = expenseDetails.id;
    expenseLi.classList.add(expenseDetails.type || "expense");
    const textSpan = document.createElement("span");
    textSpan.textContent = `${expenseDetails.expenseamount} - ${expenseDetails.description} - ${expenseDetails.category}`;
    expenseLi.appendChild(textSpan);
    filteredList.appendChild(expenseLi);
  });
}
