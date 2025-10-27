// === Display message before any search ===
const displayInitialMessage = () => {
  const phonesContainer = document.getElementById("phones-container");
  phonesContainer.innerHTML = `
    <div class="justify text-center text-gray-500 mx-132 w-full">
      <h2 class="text-xl font-semibold">Search your phone above to see results.</h2>
    </div>
  `;
};

// === Fetch and display phones ===
const loadPhones = async (searchText, showAll = false) => {
  toggleLoader(true); // show loader

  try {
    const url = `https://openapi.programming-hero.com/api/phones?search=${searchText}`;
    const res = await fetch(url);
    const data = await res.json();

    // Wait for 3 seconds before displaying
    setTimeout(() => {
      displayPhones(data.data, showAll);
      toggleLoader(false);
    }, 3000);
  } catch (error) {
    console.error("Error fetching phone data:", error);
    toggleLoader(false);
  }
};

// === Display phones in the DOM ===
const displayPhones = (phones, showAll = false) => {
  const phonesContainer = document.getElementById("phones-container");
  const noFoundMessage = document.getElementById("no-found-message");
  const showAllSection = document.getElementById("show-all");
  phonesContainer.innerHTML = ""; // clear old data

  if (!phones || phones.length === 0) {
    noFoundMessage.classList.remove("d-none");
    showAllSection.classList.add("d-none");
    return;
  } else {
    noFoundMessage.classList.add("d-none");
  }

  // If more than 10 phones, show only 10 unless showAll is true
  const limitedPhones = showAll ? phones : phones.slice(0, 10);

  limitedPhones.forEach((phone) => {
    const phoneDiv = document.createElement("div");
    phoneDiv.classList.add("card", "p-4");

    phoneDiv.innerHTML = `
      <img src="${phone.image}" class="card-img-top" alt="${phone.phone_name}">
      <div class="card-body">
        <h5 class="card-title">${phone.phone_name}</h5>
        <p class="card-text">Click below to see details.</p>
        <button onclick="loadPhoneDetails('${phone.slug}')" 
                class="btn btn-primary" 
                data-bs-toggle="modal" 
                data-bs-target="#phoneDetailModal">
          Show Details
        </button>
      </div>
    `;
    phonesContainer.appendChild(phoneDiv);
  });

  // Handle Show All button visibility
  if (phones.length > 10 && !showAll) {
    showAllSection.classList.remove("d-none");
    const btnShowAll = document.getElementById("btn-show-all");
    btnShowAll.onclick = () => {
      displayPhones(phones, true);
      showAllSection.classList.add("d-none");
    };
  } else {
    showAllSection.classList.add("d-none");
  }
};

// === Show/Hide Loader ===
const toggleLoader = (isLoading) => {
  const loader = document.getElementById("loader");
  if (isLoading) {
    loader.classList.remove("d-none");
  } else {
    loader.classList.add("d-none");
  }
};

// === Search Handler ===
document.getElementById("SearchPhone").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    const searchText = e.target.value.trim();
    if (searchText === "") {
      displayInitialMessage();
      return;
    }
    loadPhones(searchText);
  }
});

// === Fetch and display phone details (for Show Details button) ===
const loadPhoneDetails = async (id) => {
  try {
    const url = `https://openapi.programming-hero.com/api/phone/${id}`;
    const res = await fetch(url);
    const data = await res.json();
    showPhoneDetails(data.data);
  } catch (error) {
    console.error("Error fetching phone details:", error);
  }
};

// === Modal content display ===
const showPhoneDetails = (phone) => {
  const modalTitle = document.getElementById("phoneDetailModalLabel");
  const modalBody = document.getElementById("phone-details");

  modalTitle.textContent = phone.name || "No Name Found";

  const { storage, memory, displaySize, chipSet } = phone.mainFeatures || {};

  modalBody.innerHTML = `
    <p><strong>Brand:</strong> ${phone.brand || "N/A"}</p>
    <p><strong>Storage:</strong> ${storage || "N/A"}</p>
    <p><strong>Memory:</strong> ${memory || "N/A"}</p>
    <p><strong>Display Size:</strong> ${displaySize || "N/A"}</p>
    <p><strong>Chipset:</strong> ${chipSet || "N/A"}</p>
  `;
};

// === Home Button: Reset to Initial State ===
document.getElementById("home-btn").addEventListener("click", () => {
  document.getElementById("SearchPhone").value = "";
  document.getElementById("no-found-message").classList.add("d-none");
  document.getElementById("loader").classList.add("d-none");
  document.getElementById("show-all").classList.add("d-none");
  displayInitialMessage();
});

// === Dropdown Toggle & Click Handlers ===
const dropdownBtn = document.querySelector(".btn-ghost");
const brandMenu = document.getElementById("brand-menu");

dropdownBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  brandMenu.classList.toggle("hidden");
});

document.addEventListener("click", (e) => {
  if (!dropdownBtn.contains(e.target) && !brandMenu.contains(e.target)) {
    brandMenu.classList.add("hidden");
  }
});

brandMenu.addEventListener("click", (e) => {
  e.preventDefault();
  const item = e.target.closest(".brand-item");
  if (!item) return;

  const brand = item.dataset.brand;
  brandMenu.classList.add("hidden");

  if (brand === "show-all") {
    displayInitialMessage();
    document.getElementById("SearchPhone").value = "";
  } else {
    loadPhones(brand);
  }
});

// === Initial State: show "Search your phone" message ===
displayInitialMessage();
