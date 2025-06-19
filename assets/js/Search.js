import AirportSearch from "./components/search/AirportSearch.js";
import DatePicker from "./components/search/DatePicker.js";
import Travellers from "./components/search/Travellers.js";
import FlightTravelType from "./components/search/FlightTravelType.js";

/**
 * Flight Search Controller Class
 *
 * Manages the flight search interface components including airport selection,
 * date picking, travel type selection, and traveller configuration.
 * Acts as a central coordinator between UI elements and their respective
 * component classes.
 */
class Search {
  // Core properties
  flightSearch = {}; // Container for all search component instances
  openedModal = null; // Tracks currently opened modal to prevent multiple modals
  dateSection = null; // Reference to date section DOM element for layout updates
  elements = {}; // Cache of DOM elements for performance
  input_bucket = {};

  /**
   * Initialize the flight search interface
   *
   * @param {Object} options - Configuration object containing DOM element references
   * @param {HTMLElement} options.from_airport - Origin airport selection element
   * @param {HTMLElement} options.to_airport - Destination airport selection element
   * @param {HTMLElement} options.departure_date - Departure date selection element
   * @param {HTMLElement} options.return_date - Return date selection element
   * @param {HTMLElement} options.traveller_class - Traveller and class selection element
   * @param {HTMLElement} options.travel_types - Travel type selection element
   * @param {HTMLElement} options.date_section - Container for date selection layout
   * @param {HTMLElement} options.from_airport_search_modal - Modal for origin airport search
   * @param {HTMLElement} options.to_airport_search_modal - Modal for destination airport search
   * @param {HTMLElement} options.calendar_modal - Modal for date picker
   * @param {HTMLElement} options.traveller_modal - Modal for traveller selection
   */
  init_flights(options) {
    // Validate required DOM elements
    const fields = [
      "from_airport",
      "to_airport",
      "departure_date",
      "return_date",
      "traveller_class",
      "travel_types",
    ];

    // Throw error if any required element is missing
    for (let field of fields) {
      if (!options[field]) {
        throw new Error(`Missing required input holder: ${field}`);
      }
    }

    // Store reference to date section for dynamic layout changes
    this.dateSection = options.date_section;

    // Initialize all search components
    this.registerAirportSearch(options);
    this.registerDatePicker(options);
    this.registerTravelTypes(options);
    this.registerTravellers(options);

    // register extra inputs here...
    this.registerExtraInputs(options);

    // submission -> preprocess, validate, send
    this.registerSubmission(options);
  }

  // ========================================
  // AIRPORT SEARCH CALLBACKS
  // ========================================

  /**
   * Callback: Handles selection of origin airport
   * Updates UI with selected airport information and closes modal
   *
   * @param {Object} e - Airport object containing airport details
   * @param {string} e.municipality - City name
   * @param {string} e.iata_code - Airport IATA code (e.g., 'JFK')
   * @param {string} e.airport_name - Full airport name
   */
  onFromAirportSelect = (e) => {
    // update input bucket.
    this.input_bucket.from_airport = e;

    // Update city name in excerpt
    this.elements.from_airport.excerpt.textContent = e.municipality;
    // Update airport code and name in main text
    this.elements.from_airport.text.textContent = `[${e.iata_code}] ${e.airport_name}`;
    // Close the airport search modal
    this.flightSearch.from_airportSearch.close();
  };

  /**
   * Callback: Handles selection of destination airport
   * Updates UI with selected airport information and closes modal
   *
   * @param {Object} e - Airport object containing airport details
   * @param {string} e.municipality - City name
   * @param {string} e.iata_code - Airport IATA code (e.g., 'LAX')
   * @param {string} e.airport_name - Full airport name
   */
  onToAirportSelect = (e) => {
    // update input bucket.
    this.input_bucket.to_airport = e;

    // Update city name in excerpt
    this.elements.to_airport.excerpt.textContent = e.municipality;
    // Update airport code and name in main text
    this.elements.to_airport.text.textContent = `[${e.iata_code}] ${e.airport_name}`;
    // Close the airport search modal
    this.flightSearch.to_airportSearch.close();
  };

  /**
   * Callback: Handles click on origin airport field
   * Opens the airport search modal for selecting departure airport
   */
  onFromAirportClick = () => {
    // Ensure only one modal is open at a time
    this.swapOpenModal("from_airportSearch");
    // Open the origin airport search modal
    this.flightSearch.from_airportSearch.open();
  };

  /**
   * Callback: Handles click on destination airport field
   * Opens the airport search modal for selecting arrival airport
   */
  onToAirportClick = () => {
    // Ensure only one modal is open at a time
    this.swapOpenModal("to_airportSearch");
    // Open the destination airport search modal
    this.flightSearch.to_airportSearch.open();
  };

  // ========================================
  // DATE PICKER CALLBACKS
  // ========================================

  /**
   * Callback: Handles single date selection (one-way flights)
   * Updates departure date display and closes date picker
   *
   * @param {Date} e - Selected date object
   */
  onDateSelected = (e) => {
    // update input bucket.
    this.input_bucket.depart_date = e;

    // Convert date to readable format
    const DepartureDate = this.flightSearch.datepicker.getReadableDate(e);
    // Get day name (e.g., 'Monday')
    const departDay = this.flightSearch.datepicker.getDayName(e);

    // Update departure date display
    this.elements.departure_date.excerpt.textContent = DepartureDate;
    this.elements.departure_date.text.textContent = departDay;

    // Close the date picker modal
    this.flightSearch.datepicker.close();
  };

  /**
   * Callback: Handles date range selection (round-trip flights)
   * Updates both departure and return date displays and closes date picker
   *
   * @param {Object} e - Range object containing from and to dates
   * @param {Date} e.from - Departure date
   * @param {Date} e.to - Return date
   */
  onRangeSelected = (e) => {
    // update input bucket.
    this.input_bucket.depart_date = e.from;
    this.input_bucket.return_date = e.to;

    // Format both dates for display
    const DepartureDate = this.flightSearch.datepicker.getReadableDate(e.from);
    const ReturnDate = this.flightSearch.datepicker.getReadableDate(e.to);

    // Get day names for both dates
    const departDay = this.flightSearch.datepicker.getDayName(e.from);
    const returnDay = this.flightSearch.datepicker.getDayName(e.to);

    // Update departure date display
    this.elements.departure_date.excerpt.textContent = DepartureDate;
    this.elements.departure_date.text.textContent = departDay;

    // Update return date display
    this.elements.return_date.excerpt.textContent = ReturnDate;
    this.elements.return_date.text.textContent = returnDay;

    // Close the date picker modal
    this.flightSearch.datepicker.close();
  };

  /**
   * Callback: Handles start of range selection
   * Updates departure date immediately when user starts selecting a range
   *
   * @param {Date} e - Selected start date
   * @param {Object} instance - DatePicker instance for accessing utility methods
   */
  onRangeSelectStart = (e, instance) => {
    // updating input bucket
    this.input_bucket.depart_date = e;

    // Format the start date
    const DepartureDate = instance.getReadableDate(e);
    const departDay = instance.getDayName(e);

    // Update departure date display immediately
    this.elements.departure_date.excerpt.textContent = DepartureDate;
    this.elements.departure_date.text.textContent = departDay;
  };

  /**
   * Callback: Handles date picker initialization
   * Sets initial date selection when date picker is ready
   *
   * @param {Object} instance - DatePicker instance
   */
  onDatePickerReady = (instance) => {
    // Pre-select the from date when date picker loads
    instance.selectDate(instance.fromDate);
  };

  /**
   * Callback: Handles click on departure date field
   * Opens the date picker modal focused on departure date selection
   */
  onDepartureDateClick = () => {
    // Ensure only one modal is open at a time
    this.swapOpenModal("datepicker");
    // Open the calendar modal
    this.flightSearch.datepicker.open();
  };

  /**
   * Callback: Handles click on return date field
   * Opens the date picker modal focused on return date selection
   */
  onReturnDateClick = () => {
    // Ensure only one modal is open at a time
    this.swapOpenModal("datepicker");
    // Open the calendar modal
    this.flightSearch.datepicker.open();
  };

  // ========================================
  // TRAVEL TYPE CALLBACKS
  // ========================================

  /**
   * Callback: Handles travel type change (one-way vs round-trip)
   * Adjusts the date section layout and calendar behavior based on travel type
   *
   * @param {string} type - Travel type ('oneway' or 'roundtrip')
   */
  onTravelTypeUpdate = (type) => {
    // Updating Travel Type
    this.input_bucket.travel_type = type;

    // sideffect : removing return date on oneway trip.
    if (type === "oneway" && this.input_bucket.return_date) {
      delete this.input_bucket.return_date;
    }

    // Update date section layout based on travel type
    this.updateDateSection(type);
  };

  /**
   * Callback: Handles click on travel types section
   * Closes any open modals when travel type is clicked
   */
  onTravelTypesClick = () => {
    // Close any open modal when travel type is selected
    this.swapOpenModal(null);
  };

  // ========================================
  // TRAVELLER CALLBACKS
  // ========================================

  /**
   * Callback: Handles update to traveller count
   * Updates the display text to show current number of travellers
   *
   * @param {Object} travellers - Traveller count object
   * @param {number} travellers.total - Total number of travellers
   */
  onTravellerCountUpdate = (travellers) => {
    // updating input bucket.
    this.input_bucket.travellers = travellers;

    // Handle singular/plural text
    let is_multiple = ``;
    if (travellers.total > 1) {
      is_multiple = `s`;
    }

    // Update traveller count display
    this.elements.travellers.excerpt.textContent = `${travellers.total} Traveller${is_multiple}`;
  };

  /**
   * Callback: Handles completion of traveller selection
   * Closes the traveller modal when user is done selecting
   */
  onTravellersDone = () => {
    // Close the traveller selection modal
    this.flightSearch.travellers.close();
  };

  /**
   * Callback: Handles selection of group booking (>9 travellers)
   * Updates display to show group booking status
   */
  onGroupSelected = () => {
    // update input bucket.
    this.input_bucket.travellers = "group_booking";

    // Update display for group bookings
    this.elements.travellers.excerpt.textContent = `>9 Travellers`;
  };

  /**
   * Callback: Handles travel class selection update
   * Updates the display text to show selected travel class
   *
   * @param {string} e - Selected travel class (e.g., 'Economy', 'Business', 'First')
   */
  onTravelClassUpdate = (e) => {
    // update input bucket.
    this.input_bucket.travel_class = e;

    // Update travel class display
    this.elements.travellers.text.textContent = e;
  };

  /**
   * Callback: Handles click on traveller class field
   * Opens the traveller selection modal
   */
  onTravellerClassClick = () => {
    // Ensure only one modal is open at a time
    this.swapOpenModal("travellers");
    // Open the traveller selection modal
    this.flightSearch.travellers.open();
  };

  /**
   * Callback:when traveller modal is ready
   * trigger default passenger count of adults to 1
   */
  onTravellersCounterReady = (instance) => {
    this.input_bucket.travel_class = "economy";
    instance.increaseTravellerCount("adults");
  };

  // ========================================
  // COMPONENT REGISTRATION METHODS
  // ========================================

  /**
   * Register airport search components and their event handlers
   * Sets up both origin and destination airport search functionality
   *
   * @param {Object} options - Configuration object with DOM elements
   */
  registerAirportSearch(options) {
    // Cache DOM elements for origin airport selection
    this.elements.from_airport = {
      excerpt: options.from_airport.getElementsByClassName("excerpt")[0], // City name display
      text: options.from_airport.getElementsByClassName("text")[0], // Airport code and name display
    };

    // Cache DOM elements for destination airport selection
    this.elements.to_airport = {
      excerpt: options.to_airport.getElementsByClassName("excerpt")[0], // City name display
      text: options.to_airport.getElementsByClassName("text")[0], // Airport code and name display
    };

    // Initialize origin airport search component
    this.flightSearch.from_airportSearch = new AirportSearch({
      modal: options.from_airport_search_modal, // Modal container element
      onResultClick: this.onFromAirportSelect, // Callback when airport is selected
    });

    // Attach click event to origin airport field
    options.from_airport.addEventListener("click", this.onFromAirportClick);

    // Initialize destination airport search component
    this.flightSearch.to_airportSearch = new AirportSearch({
      modal: options.to_airport_search_modal, // Modal container element
      onResultClick: this.onToAirportSelect, // Callback when airport is selected
    });

    // Attach click event to destination airport field
    options.to_airport.addEventListener("click", this.onToAirportClick);
  }

  /**
   * Register date picker component and its event handlers
   * Sets up calendar functionality for both departure and return dates
   *
   * @param {Object} options - Configuration object with DOM elements
   */
  registerDatePicker(options) {
    // Cache DOM elements for departure date display
    this.elements.departure_date = {
      excerpt: options.departure_date.getElementsByClassName("excerpt")[0], // Formatted date display
      text: options.departure_date.getElementsByClassName("text")[0], // Day name display
    };

    // Cache DOM elements for return date display
    this.elements.return_date = {
      excerpt: options.return_date.getElementsByClassName("excerpt")[0], // Formatted date display
      text: options.return_date.getElementsByClassName("text")[0], // Day name display
    };

    // Initialize date picker component with range selection capabilities
    this.flightSearch.datepicker = new DatePicker({
      modal: options.calendar_modal, // Modal container element
      isRangeAllowed: true, // Enable date range selection for round-trip
      onRangeSelectionEnd: this.onRangeSelected, // Callback when range is fully selected
      onRangeSelectionStart: this.onRangeSelectStart, // Callback when range selection starts
      onSingleSelected: this.onDateSelected, // Callback for single date selection
      onReady: this.onDatePickerReady, // Callback when date picker is initialized
    });

    // Attach click events to date fields
    options.departure_date.addEventListener("click", this.onDepartureDateClick);
    options.return_date.addEventListener("click", this.onReturnDateClick);
  }

  /**
   * Register travel type component (one-way vs round-trip)
   * Sets up toggle functionality between travel types
   *
   * @param {Object} options - Configuration object with DOM elements
   */
  registerTravelTypes(options) {
    // inserting default travel type value.
    this.input_bucket.travel_type = "roundtrip";

    // Initialize travel type component
    this.flightSearch.travelType = new FlightTravelType({
      wrapper: options.travel_types, // Container element for travel type selection
      onUpdate: this.onTravelTypeUpdate, // Callback when travel type changes
    });

    // Attach click event to travel types section
    options.travel_types.addEventListener("click", this.onTravelTypesClick);
  }

  /**
   * Register traveller selection component
   * Sets up passenger count and travel class selection functionality
   *
   * @param {Object} options - Configuration object with DOM elements
   */
  registerTravellers(options) {
    // Cache DOM elements for traveller information display
    this.elements.travellers = {
      excerpt: options.traveller_class.getElementsByClassName("excerpt")[0], // Traveller count display
      text: options.traveller_class.getElementsByClassName("text")[0], // Travel class display
    };

    // Initialize traveller selection component
    this.flightSearch.travellers = new Travellers({
      modal: options.traveller_modal, // Modal container element
      onTravellerCountUpdate: this.onTravellerCountUpdate, // Callback when passenger count changes
      onDone: this.onTravellersDone, // Callback when selection is complete
      onGroupSelected: this.onGroupSelected, // Callback for group booking selection
      onSelectedTravelClass: this.onTravelClassUpdate, // Callback when travel class changes
      onReady: this.onTravellersCounterReady,
    });

    // Attach click event to traveller class field
    options.traveller_class.addEventListener(
      "click",
      this.onTravellerClassClick
    );
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  /**
   * Update date section layout based on travel type
   * Adjusts column widths and calendar display for one-way vs round-trip
   *
   * @param {string} type - Travel type ('oneway' or 'roundtrip')
   */
  updateDateSection(type) {
    // Get date section columns
    let cols = this.dateSection.getElementsByClassName("col-sm-4");

    if (type === "oneway") {
      // For one-way trips: expand departure date column, hide return date
      cols[0].style.width = "66.66666667%"; // Expand departure date column
      cols[1].classList.add("hidden"); // Hide return date column

      // Configure calendar for single month display
      this.flightSearch.datepicker.monthsPerPage = 1;
      this.flightSearch.datepicker.isRangeAllowed = false;
      this.flightSearch.datepicker.populateCalendar();
    }

    if (type === "roundtrip") {
      // For round-trip: restore original layout, show both date columns
      cols[0].style.width = ""; // Reset departure date column width
      cols[1].classList.remove("hidden"); // Show return date column

      // Configure calendar for dual month display with range selection
      this.flightSearch.datepicker.monthsPerPage = 2;
      this.flightSearch.datepicker.isRangeAllowed = true;
      this.flightSearch.datepicker.populateCalendar();
    }
  }

  /**
   * Manage modal state to ensure only one modal is open at a time
   * Closes currently open modal and tracks the new modal
   *
   * @param {string|null} currentModalObj - Key of the modal to open, or null to close all
   */
  swapOpenModal(currentModalObj) {
    // Close currently open modal if one exists
    if (this.openedModal) {
      this.flightSearch[this.openedModal].close();
    }

    // Update reference to currently open modal
    this.openedModal = currentModalObj;
  }

  // submission
  registerSubmission(options) {
    this.elements.submit_button = options.search_button;

    this.elements.submit_button.addEventListener("click", () => {
      this.submit_form();
    });
  }

  registerExtraInputs(options) {
    // get option.extrainputs div, gather inputs, register them.
    let exinputs = options.wrapper.getElementsByClassName("extra_input");
    this.input_bucket.exinputs = {};

    for (let i = 0; i < exinputs.length; i++) {
      exinputs[i].addEventListener("input", () => {
        this.input_bucket.exinputs[exinputs[i].name] = exinputs[i].value;
      });
    }
  }

  prepareInputs(bucket) {
    let inputs = {};

    if (bucket.travel_type) {
      inputs.travel_type = bucket.travel_type;
    }

    if (bucket.from_airport) {
      inputs.from = bucket.from_airport.iata_code;
    }

    if (bucket.to_airport) {
      inputs.to = bucket.to_airport.iata_code;
    }

    if (bucket.depart_date) {
      inputs.departure = this.flightSearch.datepicker.formatDate(
        bucket.depart_date,
        "dd-MM-yyyy"
      );
    }

    if (bucket.return_date) {
      inputs.return_date = this.flightSearch.datepicker.formatDate(
        bucket.return_date,
        "dd-MM-yyyy"
      );
    }

    if (bucket.travellers) {
      if (bucket.travellers.adults > 0) {
        inputs.adults = bucket.travellers.adults;
      }
      if (bucket.travellers.children > 0) {
        inputs.children = bucket.travellers.children;
      }
      if (bucket.travellers.infants > 0) {
        inputs.infants = bucket.travellers.infants;
      }
      if (bucket.travellers == "group_booking") {
        inputs.group = 1;
      }
    }

    if (bucket.travel_class) {
      inputs.travel_class = bucket.travel_class;
    }

    inputs.exinputs = bucket.exinputs;

    return inputs;
  }

  validateInputs(inputs) {
    const errors = [];

    // Required: from and to airport codes (must be 3-letter IATA code)
    if (!inputs.from || !/^[A-Z]{3}$/.test(inputs.from)) {
      errors.push("- Invalid or missing origin airport.");
    }

    if (!inputs.to || !/^[A-Z]{3}$/.test(inputs.to)) {
      errors.push("- Invalid or missing destination airport.");
    }

    // Required: departure date in format dd-MM-yyyy
    if (!inputs.departure || !/^\d{2}-\d{2}-\d{4}$/.test(inputs.departure)) {
      errors.push("- Invalid or missing departure date.");
    }

    // Optional: return date (if present, must be in valid format)
    if (
      inputs.travel_type === "roundtrip" &&
      !/^\d{2}-\d{2}-\d{4}$/.test(inputs.return_date)
    ) {
      errors.push("- Invalid return date format.");
    }

    // Required: at least 1 adult or group booking
    const totalPassengers =
      (inputs.adults || 0) + (inputs.children || 0) + (inputs.infants || 0);
    if (!inputs.group && totalPassengers === 0) {
      errors.push("- At least one passenger must be selected.");
    }

    // Optional: travel class (must be one of predefined list)
    const allowedClasses = [
      "economy",
      "premium economy",
      "business",
      "first class",
    ];
    if (
      inputs.travel_class &&
      !allowedClasses.includes(inputs.travel_class.toLowerCase())
    ) {
      errors.push("- Invalid travel class selected.");
    }

    // extra inputs validations
    if (
      !inputs.exinputs.name ||
      !/^[a-zA-Z\s]{2,}$/.test(inputs.exinputs.name.trim())
    ) {
      errors.push("- Invalid or missing name.");
    }

    if (
      !inputs.exinputs.contact ||
      !/^[6-9]\d{9}$/.test(inputs.exinputs.contact)
    ) {
      errors.push(
        "- Invalid contact number. Must be a 10-digit mobile number."
      );
    }

    if (
      !inputs.exinputs.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(inputs.exinputs.email)
    ) {
      errors.push("- Invalid email address.");
    }

    // Log or handle validation result
    if (errors.length > 0) {
      alert("Please correct the following errors:\n" + errors.join("\n"));
      return false;
    }

    return true;
  }

  submit_form() {
    const inputs = this.prepareInputs(this.input_bucket);
    const isValid = this.validateInputs(inputs);
    if (!isValid) return;

    // Create a form element
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "mail.php";
    form.style.display = "none"; // hide the form from view

    // Helper function to append fields
    const appendField = (name, value) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      form.appendChild(input);
    };

    // Flatten inputs including nested exinputs
    for (let key in inputs) {
      if (key === "exinputs") {
        for (let subKey in inputs.exinputs) {
          appendField(subKey, inputs.exinputs[subKey]);
        }
      } else {
        appendField(key, inputs[key]);
      }
    }

    // Append and submit the form
    document.body.appendChild(form);
    form.submit();
  }
}

export default Search;
