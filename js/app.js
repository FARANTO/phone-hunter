// === Fetch and display phones ===
const loadPhones = async (searchText = "iphone") => {
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
  phonesContainer.innerHTML = ""; // clear container before adding new

  if (phones.length === 0) {
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
    loadPhones(searchText);
  }
});

// === Fetch and display phone details (when Show Details button clicked) ===
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

// === Example function to show phone details (can be customized to fit your modal) ===
const showPhoneDetails = (phone) => {
  console.log("Phone Details:", phone);
  // Example: You can dynamically fill a modal or alert
  alert(`Model: ${phone.name}\nBrand: ${phone.brand}`);
};

// === Initial load ===
loadPhones();


