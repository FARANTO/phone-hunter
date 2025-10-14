// === Display message before any search ===
const displayInitialMessage = () => {
  const phonesContainer = document.getElementById("phones-container");
  phonesContainer.innerHTML = `
    <div class="flex justify center text-center text-gray-500 mx-110 mt-10 w-full">
      <h2 class="text-xl font-semibold"> Search your phone above to see results.</h2>
    </div>
  `;
};

// === Fetch and display phones ===
const loadPhones = async (searchText) => {
  toggleLoader(true); // show loader

  try {
    const url = `https://openapi.programming-hero.com/api/phones?search=${searchText}`;
    const res = await fetch(url);
    const data = await res.json();

    displayPhones(data.data);
  } catch (error) {
    console.error("Error fetching phone data:", error);
  } finally {
    toggleLoader(false); // hide loader after done
  }
};

// === Display phones in the DOM ===
const displayPhones = (phones) => {
  const phonesContainer = document.getElementById("phones-container");
  const noFoundMessage = document.getElementById("no-found-message");
  phonesContainer.innerHTML = ""; // clear old data

  if (!phones || phones.length === 0) {
    noFoundMessage.classList.remove("d-none");
  } else {
    noFoundMessage.classList.add("d-none");
  }

  phones.forEach((phone) => {
    const phoneDiv = document.createElement("div");
    phoneDiv.classList.add("card", "p-4");

    phoneDiv.innerHTML = `
      <img src="${phone.image}" class="card-img-top" alt="${phone.phone_name}">
      <div class="card-body">
        <h5 class="card-title">${phone.phone_name}</h5>
        <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content.</p>
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

// === Example modal content display ===
const showPhoneDetails = (phone) => {
  console.log("Phone Details:", phone);
  alert(`Model: ${phone.name}\nBrand: ${phone.brand}`);
};

// === Initial State: show "Search your phone" message ===
displayInitialMessage();
