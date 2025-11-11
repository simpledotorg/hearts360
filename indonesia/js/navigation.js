document.addEventListener("DOMContentLoaded", () => {
  // List item toggle: open and collapse
  var toggler = document.getElementsByClassName("caret");
  for (let i = 0; i < toggler.length; i++) {
    toggler[i].addEventListener("click", function () {
      this.parentElement.querySelector(".nested").classList.toggle("active");
      this.classList.toggle("caret-down");
    });
  }

  // Show results when typing in the search input and hide list
  const searchInput = document.getElementById("region-search");
  const results = document.getElementById("search-results");
  const regionList = document.getElementById("myUL");

  // Arrays to store the extracted items
  const states = [];
  const districts = [];
  const subDistricts = [];
  const facilities = [];
  const stateMapping = {}; // Maps districts, sub-districts, and facilities to their parent state

  // Extract states
  document.querySelectorAll(".region-state").forEach((state) => {
    const stateName = state.querySelector("a").textContent.trim();
    states.push(stateName);

    // Map districts, sub-districts, and facilities to this state
    const stateItems = state.querySelectorAll(
      ".region-district, .region-subdistrict, .region-facility"
    );
    stateItems.forEach((item) => {
      const itemName = item.querySelector("a").textContent.trim();
      stateMapping[itemName] = stateName;
    });
  });

  // Extract districts
  document.querySelectorAll(".region-district > a").forEach((district) => {
    districts.push(district.textContent.trim());
  });

  // Extract sub-districts
  document
    .querySelectorAll(".region-subdistrict > a")
    .forEach((subDistrict) => {
      subDistricts.push(subDistrict.textContent.trim());
    });

  // Extract facilities
  document.querySelectorAll(".region-facility > a").forEach((facility) => {
    facilities.push(facility.textContent.trim());
  });

  // Add an event listener to the input field
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();

    if (query !== "") {
      // Show the results and hide the list
      results.classList.remove("hidden");
      regionList.classList.add("hidden");
      filterAndDisplayResults(query);
    } else {
      // Hide the results and show the list
      results.classList.add("hidden");
      regionList.classList.remove("hidden");
      results.innerHTML = ""; // Clear previous results
    }
  });

  // Function to filter and display results
  function filterAndDisplayResults(query) {
    const maxItems = 3; // Maximum items per type

    // Filter the items
    const filteredStates = states.filter((state) =>
      state.toLowerCase().includes(query)
    );
    const filteredDistricts = districts.filter((district) =>
      district.toLowerCase().includes(query)
    );
    const filteredSubDistricts = subDistricts.filter((subDistrict) =>
      subDistrict.toLowerCase().includes(query)
    );
    const filteredFacilities = facilities.filter((facility) =>
      facility.toLowerCase().includes(query)
    );

    // Clear previous results
    results.innerHTML = "";

    // Display filtered results
    displayFilteredResults("State", filteredStates, maxItems);
    displayFilteredResults("District", filteredDistricts, maxItems);
    displayFilteredResults("Sub-District", filteredSubDistricts, maxItems);
    displayFilteredResults("Facility", filteredFacilities, maxItems);

    // Show 'No results' if all are empty
    if (
      filteredStates.length === 0 &&
      filteredDistricts.length === 0 &&
      filteredSubDistricts.length === 0 &&
      filteredFacilities.length === 0
    ) {
      results.innerHTML = `<dd class="results-state"><p class="no-result">Tidak ada hasil.</p></dd>`;
    }
  }

  // Function to display filtered results
  function displayFilteredResults(title, items, maxItems) {
    if (items.length > 0) {
      // Create the section title
      const sectionTitle = document.createElement("dt");
      sectionTitle.classList.add("search-section");
      // Translate section headers to Indonesian
      const titleMap = {
        "State": "Provinsi",
        "District": "Kabupaten/Kota",
        "Sub-District": "Kecamatan",
        "Sub-district": "Kecamatan",
        "Facility": "Fasilitas",
      };
      sectionTitle.textContent = titleMap[title] || title;

      // Append to results
      results.appendChild(sectionTitle);

      // Create the list of items
      items.slice(0, maxItems).forEach((item) => {
        const stateName = stateMapping[item]
          ? `<span class="state-info">(${stateMapping[item]})</span>`
          : ""; // Get the state name if applicable and wrap it in a span
        const listItem = document.createElement("dd");
        listItem.classList.add("results-state");
        listItem.innerHTML = `<a href="#">${highlightMatch(
          item,
          searchInput.value.trim()
        )} ${stateName}</a>`;
        results.appendChild(listItem);
      });
    }
  }

  // Function to highlight matched text
  function highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, `<em>$1</em>`);
  }
});
