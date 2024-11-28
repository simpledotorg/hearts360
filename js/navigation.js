// List item toggle: open and collapse
// Note: this also creates the nested list of items
var toggler = document.getElementsByClassName("caret");
var i;

for (i = 0; i < toggler.length; i++) {
  toggler[i].addEventListener("click", function () {
    this.parentElement.querySelector(".nested").classList.toggle("active");
    this.classList.toggle("caret-down");
  });
}

// Show results when typing in the search input and hide list
const searchInput = document.getElementById("region-search");
const results = document.getElementById("search-results");
const regionList = document.getElementById("myUL");

// Add an event listener to the input field
searchInput.addEventListener("input", () => {
  if (searchInput.value.trim() !== "") {
    // Show the results if input is not empty
    results.classList.remove("hidden");
    regionList.classList.add("hidden");
  } else {
    // Hide the results if input is empty
    results.classList.add("hidden");
    regionList.classList.remove("hidden");
  }
});

