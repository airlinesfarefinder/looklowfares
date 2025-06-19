class AirportSearch {
  fieldElement = {};
  modal = null;
  inputEle = null;
  resultsHolder = null;
  onResultClick = null;
  selectedResult = null;

  constructor(options) {
    if (!options.modal) {
      throw new Error(`AirportSearch: Missing required modal element`);
    }

    this.modal = options.modal;

    this.populateModal();

    // traveller update
    if (typeof options.onResultClick === "function") {
      this.onResultClick = options.onResultClick;
    }
  }

  populateModal() {
    // Create search_input div
    const searchInputDiv = document.createElement("div");
    searchInputDiv.className = "search_input";

    const input = document.createElement("input");
    input.type = "text";
    input.className = "input";
    input.placeholder = "From";

    searchInputDiv.append(input);

    // Create results div
    const resultsDiv = document.createElement("div");
    resultsDiv.className = "results";

    const ul = document.createElement("ul");
    ul.className = "results_holder";

    resultsDiv.append(ul);

    // Append to modal
    this.modal.append(searchInputDiv);
    this.modal.append(resultsDiv);

    // exposing in class for others method to use.
    this.resultsHolder = ul;
    this.inputEle = input;

    // adding eventListener
    input.addEventListener("input", () => {
      this.search(input.value);
    });
  }

  search(value) {
    if (value.length < 3) {
      return;
    }

    this.flushResults();

    const url = "airports.php";

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ search: value }),
    })
      .then((response) => response.json())
      .then((data) => {
        this.populateResult(data);
      })
      .catch((error) => {
        console.error("Search error:", error);
      });
  }

  populateResult(data) {
    if (!data || (Array.isArray(data) && data.length < 1)) {
      console.log("empty result");
      return;
    }

    const resultFragment = document.createDocumentFragment();

    for (let index = 0; index < data.length; index++) {
      resultFragment.append(this.prepareResultLi(data[index]));
    }

    this.resultsHolder.append(resultFragment);
  }

  prepareResultLi(airport) {
    const resultLi = document.createElement("li");

    // setting values
    resultLi.setAttribute("data-iata", airport.iata_code);

    // adding event listener onclick
    resultLi.addEventListener("click", () => {
      this.selectedResult = airport;

      if (typeof this.onResultClick === "function") {
        this.onResultClick(this.getSelectedResult());
      }
    });

    // populating with html content
    resultLi.innerHTML = `<div class="text">
                              <span class="airport_name">${airport.airport_name}</span>
                              <span class="place_name">${airport.municipality}</span>
                          </div>
                          <div class="iata_code">${airport.iata_code}</div>`;

    // returning prepared resultLi
    return resultLi;
  }

  flushResults() {
    this.resultsHolder.innerHTML = `<span class="loading"></span>`;
  }

  open() {
    this.modal.classList.add("active");
    this.inputEle.focus();
  }

  close() {
    this.modal.classList.remove("active");
  }

  reset() {
    this.inputEle.value = "";
    this.resultsHolder.innerHTML = "";
  }

  // ======== GETTERS ====== //

  getSelectedResult() {
    return this.selectedResult;
  }
}

export default AirportSearch;
