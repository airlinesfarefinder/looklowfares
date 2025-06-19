import Search from "./Search.js";

let searchWrapper = document.getElementById("search_form");

if (searchWrapper) {
  let search_form = new Search({
    holder: document.getElementById("search_form"),
  });

  search_form.init_flights({
    // mainwrapper
    wrapper: document.getElementById("search_form"),
    // inputs
    travel_types: document.getElementById("travel_types"),
    from_airport: document.getElementById("from_airport"),
    to_airport: document.getElementById("to_airport"),
    departure_date: document.getElementById("departure_date"),
    return_date: document.getElementById("return_date"),
    traveller_class: document.getElementById("traveller_class"),
    search_button: document.getElementById("search_button"),
    date_section: document.getElementById("date_section"),

    // modals
    from_airport_search_modal: document.getElementById(
      "from_airport_search_modal"
    ),

    to_airport_search_modal: document.getElementById("to_airport_search_modal"),
    calendar_modal: document.getElementById("calendar_modal"),
    traveller_modal: document.getElementById("traveller_modal"),
  });
}
