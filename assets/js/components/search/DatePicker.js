/**
 * DatePicker Component
 *
 * A flexible calendar component that supports both single date selection and date range selection.
 * Features pagination through months, customizable date ranges, and various formatting options.
 *
 * Key Features:
 * - Single date or date range selection
 * - Month pagination with configurable months per page
 * - Customizable week start day (Sunday/Monday)
 * - Date validation and disabled date ranges
 * - Comprehensive callback system for selection events
 * - Flexible date formatting utilities
 */
class DatePicker {
  // Core DOM and state properties
  modal = null; // Modal container element
  fromDate = null; // Minimum selectable date
  tillDate = null; // Maximum selectable date
  weekStartDay = 0; // 0 = Sunday, 1 = Monday
  selectedDates = []; // Array of currently selected dates
  cachedMonths = []; // Cached array of month objects for performance
  monthsPerPage = 2; // Number of months to display simultaneously
  currentPage = 0; // Current pagination page index
  isRangeAllowed = false; // Whether date range selection is enabled

  // Event callback properties
  onRangeSelectionStart; // Callback when range selection begins
  onRangeSelectionEnd; // Callback when range selection completes
  onRangeSelectionReset; // Callback when range selection is reset
  onSingleSelected; // Callback when single date is selected
  onReady; // Callback when datepicker is initialized

  /**
   * Initialize the DatePicker component
   *
   * @param {Object} options - Configuration object
   * @param {HTMLElement} options.modal - Required: Modal container element
   * @param {Date|string} [options.fromDate] - Minimum selectable date (default: today)
   * @param {Date|string} [options.tillDate] - Maximum selectable date (default: 1 year from today)
   * @param {number} [options.weekStartDay=0] - Week start day (0=Sunday, 1=Monday)
   * @param {number} [options.monthsPerPage=2] - Number of months to display per page
   * @param {number} [options.currentPage=0] - Initial page index
   * @param {boolean} [options.isRangeAllowed=false] - Enable date range selection
   * @param {Function} [options.onRangeSelectionStart] - Range selection start callback
   * @param {Function} [options.onRangeSelectionEnd] - Range selection end callback
   * @param {Function} [options.onRangeSelectionReset] - Range selection reset callback
   * @param {Function} [options.onSingleSelected] - Single date selection callback
   * @param {Function} [options.onSingleSelectReset] - Single selection reset callback
   * @param {Function} [options.onReady] - Initialization complete callback
   */
  constructor(options) {
    // Validate required parameters
    if (!options.modal) {
      throw new Error(`DatePicker: Missing required modal element`);
    }

    // Set required properties
    this.modal = options.modal;

    // Configure date range with defaults
    this.fromDate = options.fromDate ? new Date(options.fromDate) : new Date();

    // Default tillDate to 1 year ahead if not provided
    this.tillDate =
      options.tillDate ||
      (() => {
        const date = new Date();
        date.setFullYear(date.getFullYear() + 1);
        return date;
      })();

    // Configure display options with defaults
    this.weekStartDay =
      typeof options.weekStartDay === "number" ? options.weekStartDay : 0;

    this.monthsPerPage =
      typeof options.monthsPerPage === "number" ? options.monthsPerPage : 2;

    this.currentPage =
      typeof options.currentPage === "number" ? options.currentPage : 0;

    this.isRangeAllowed =
      typeof options.isRangeAllowed === "boolean"
        ? options.isRangeAllowed
        : false;

    // Initialize event callbacks with no-op defaults
    this.onRangeSelectionStart =
      options.onRangeSelectionStart || function () {};
    this.onRangeSelectionEnd = options.onRangeSelectionEnd || function () {};
    this.onRangeSelectionReset =
      options.onRangeSelectionReset || function () {};
    this.onSingleSelected = options.onSingleSelected || function () {};
    this.onSingleSelectReset = options.onSingleSelectReset || function () {};
    this.onReady = options.onReady || function () {};

    // Bind navigation event handlers to maintain correct context
    this.onPrevClick = this.prevPage.bind(this);
    this.onNextClick = this.nextPage.bind(this);

    // Initialize the datepicker UI
    this.populateHeader();
    this.populateCalendar(this.currentPage);

    // Notify that initialization is complete
    this.onReady(this);
  }

  // ========================================
  // UI INITIALIZATION METHODS
  // ========================================

  /**
   * Create and populate the datepicker header with navigation controls
   * Builds the prev/next navigation buttons and attaches event listeners
   */
  populateHeader() {
    // Create header container
    const header = document.createElement("div");
    header.className = "header";

    // Create controls container for navigation buttons
    const controls = document.createElement("div");
    controls.className = "controls";

    // Create previous month button
    this.prevBtn = document.createElement("span");
    this.prevBtn.className = "prev";
    this.prevBtn.innerHTML = "<i></i>";

    // Create next month button
    this.nextBtn = document.createElement("span");
    this.nextBtn.className = "next";
    this.nextBtn.innerHTML = "<i></i>";

    // Attach navigation event listeners
    this.prevBtn.addEventListener("click", this.onPrevClick);
    this.nextBtn.addEventListener("click", this.onNextClick);

    // Assemble header structure
    controls.append(this.prevBtn);
    controls.append(this.nextBtn);
    header.append(controls);

    // Add header to modal
    this.modal.append(header);
  }

  // ========================================
  // NAVIGATION METHODS
  // ========================================

  /**
   * Navigate to previous page of months
   * Decrements currentPage and refreshes calendar display
   */
  prevPage() {
    // Prevent navigation before first page
    if (this.currentPage === 0) {
      return;
    }

    this.currentPage--;
    this.populateCalendar(this.currentPage);
  }

  /**
   * Navigate to next page of months
   * Increments currentPage and refreshes calendar display
   */
  nextPage() {
    this.currentPage++;
    this.populateCalendar(this.currentPage);
  }

  // ========================================
  // MONTH PREPARATION AND CACHING
  // ========================================

  /**
   * Prepare and cache all months between fromDate and tillDate
   * Calculates total months needed and pads to fit monthsPerPage pagination
   * Uses caching to avoid recalculation on subsequent calls
   */
  prepareMonths() {
    // Use cached months if already calculated
    if (this.cachedMonths.length > 0) {
      return;
    }

    this.months = [];
    let current = new Date(this.fromDate);

    // Generate all months between fromDate and tillDate
    while (current <= this.tillDate) {
      this.months.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }

    // Pad months array to be evenly divisible by monthsPerPage
    // This ensures pagination works correctly without partial pages
    const remainder = this.months.length % this.monthsPerPage;

    if (remainder !== 0) {
      const toAdd = this.monthsPerPage - remainder;

      // Add additional months beyond tillDate for complete pagination
      for (let i = 0; i < toAdd; i++) {
        this.months.push(new Date(current));
        current.setMonth(current.getMonth() + 1);
      }
    }

    // Cache the prepared months for performance
    this.cachedMonths = this.months;
  }

  // ========================================
  // CALENDAR RENDERING METHODS
  // ========================================

  /**
   * Populate the calendar display for a specific page
   * Renders the specified number of months per page with full date grids
   *
   * @param {number} [page=0] - Page index to display
   */
  populateCalendar(page = 0) {
    // Ensure months are prepared and cached
    this.prepareMonths();

    // Create container for months
    const months_holder = document.createElement("div");
    months_holder.className = "months_holder";

    // Add special styling for dual-month display
    if (this.monthsPerPage === 2) {
      months_holder.classList.add("two_months");
    }

    // Calculate which months to display based on pagination
    const start = page * this.monthsPerPage;
    const end = Math.min(start + this.monthsPerPage, this.months.length);

    // Render each month for current page
    for (let i = start; i < end; i++) {
      months_holder.append(this.populateMonth(this.months[i]));
    }

    // Remove previous calendar display
    const existing = this.modal.querySelector(".months_holder");
    if (existing) existing.remove();

    // Insert new calendar display
    this.modal.append(months_holder);

    // Restore selection states after re-rendering
    this.applySelectionStates();

    // Update navigation button states
    this.updateNav();
  }

  /**
   * Update navigation button states based on current page position
   * Disables buttons at boundaries and manages event listeners
   */
  updateNav() {
    const totalPages = Math.ceil(this.cachedMonths.length / this.monthsPerPage);

    // Handle previous button state
    if (this.currentPage === 0) {
      // Disable and remove listener when at first page
      this.prevBtn.classList.add("disabled");
      this.prevBtn.removeEventListener("click", this.onPrevClick);
    } else {
      // Enable and ensure listener is attached
      this.prevBtn.classList.remove("disabled");
      this.prevBtn.removeEventListener("click", this.onPrevClick); // Remove to prevent duplicates
      this.prevBtn.addEventListener("click", this.onPrevClick);
    }

    // Handle next button state
    if (this.currentPage >= totalPages - 1) {
      // Disable and remove listener when at last page
      this.nextBtn.classList.add("disabled");
      this.nextBtn.removeEventListener("click", this.onNextClick);
    } else {
      // Enable and ensure listener is attached
      this.nextBtn.classList.remove("disabled");
      this.nextBtn.removeEventListener("click", this.onNextClick); // Remove to prevent duplicates
      this.nextBtn.addEventListener("click", this.onNextClick);
    }
  }

  /**
   * Create and populate a single month display
   * Generates month title and complete day grid
   *
   * @param {Date} date - Date representing the month to display
   * @returns {HTMLElement} Complete month element
   */
  populateMonth(date) {
    // Create month container
    const month = document.createElement("div");
    month.className = "month";

    // Create and populate month title
    const title = document.createElement("div");
    title.className = "title";
    title.textContent = date.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    // Assemble month structure
    month.append(title);
    month.append(this.getDays(date)); // Add complete day grid

    return month;
  }

  /**
   * Generate complete day grid for a specific month
   * Creates weekday headers, handles month padding, and generates clickable day elements
   *
   * @param {Date} date - Date representing the month
   * @returns {HTMLElement} Complete days container with weeks and days
   */
  getDays(date) {
    const container = document.createElement("div");
    container.className = "days_holder";

    // Extract month information
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const weekStart = this.weekStartDay;

    // Add weekday header (Su, Mo, Tu, etc.)
    container.append(this.getWeekdayHeader(weekStart));

    // Calculate padding needed for month start alignment
    const firstDayIndex = new Date(year, month, 1).getDay();
    const startPadding = this.getDaysPadding(firstDayIndex, weekStart);

    // Calculate total grid size (must be complete weeks)
    const totalCells = startPadding + daysInMonth;
    const totalSlots = Math.ceil(totalCells / 7) * 7;

    let dayCounter = 1;

    // Generate week rows
    for (let week = 0; week < totalSlots / 7; week++) {
      const ul = document.createElement("ul");
      ul.className = "week";

      // Generate 7 days per week
      for (let i = 0; i < 7; i++) {
        const index = week * 7 + i;
        const li = document.createElement("li");

        // Handle empty cells (before month start or after month end)
        if (index < startPadding || index >= startPadding + daysInMonth) {
          li.className = "day empty";
          ul.append(li);
        } else {
          // Create actual day element
          const dayDate = new Date(year, month, dayCounter++);
          const isDisabled = this.shouldDisabledDay(dayDate);
          const dayEl = this.getDay(dayDate);

          if (!isDisabled) {
            // Add click handler for selectable days
            dayEl.addEventListener("click", () => {
              this.selectDate(dayDate);
            });
          } else {
            // Mark disabled days
            dayEl.classList.add("disabled");
          }

          ul.append(dayEl);
        }
      }

      container.append(ul);
    }

    return container;
  }

  /**
   * Determine if a specific day should be disabled
   * Checks if date falls outside the allowed fromDate/tillDate range
   *
   * @param {Date} dayDate - Date to check
   * @returns {boolean} True if day should be disabled
   */
  shouldDisabledDay(dayDate) {
    // Normalize dates to ignore time components
    const normalize = (date) =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const day = normalize(dayDate);
    const from = this.fromDate ? normalize(this.fromDate) : null;
    const till = this.tillDate ? normalize(this.tillDate) : null;

    // Check if date is before allowed range or after allowed range
    const isBefore = from && day < from;
    const isAfter = till && day > till;

    return isBefore || isAfter;
  }

  /**
   * Create a single day element with date data
   *
   * @param {Date} date - Date for this day element
   * @returns {HTMLElement} Day list item with embedded date data
   */
  getDay(date) {
    const day = document.createElement("li");
    day.className = "day";
    // Store date as ISO string for easy retrieval
    day.dataset.date = date.toISOString();

    const span = document.createElement("span");
    span.className = "value";
    span.textContent = date.getDate();

    day.append(span);
    return day;
  }

  /**
   * Create weekday header row (Su, Mo, Tu, etc.)
   * Handles custom week start days (Sunday vs Monday start)
   *
   * @param {number} [weekStart=0] - Week start day (0=Sunday, 1=Monday)
   * @returns {HTMLElement} Weekday header row
   */
  getWeekdayHeader(weekStart = 0) {
    const weekdayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const header = document.createElement("ul");
    header.className = "week";

    // Generate weekday headers starting from specified day
    for (let i = 0; i < 7; i++) {
      const index = (i + weekStart) % 7; // Circular array access
      const li = document.createElement("li");
      li.className = "day name";

      const span = document.createElement("span");
      span.className = "value";
      span.textContent = weekdayNames[index];

      li.append(span);
      header.append(li);
    }

    return header;
  }

  /**
   * Calculate padding needed for month start alignment
   * Determines how many empty cells needed before first day of month
   *
   * @param {number} firstDayIndex - Day of week for month's first day (0-6)
   * @param {number} [weekStart=0] - Week start day (0=Sunday, 1=Monday)
   * @returns {number} Number of empty cells needed
   */
  getDaysPadding(firstDayIndex, weekStart = 0) {
    return (firstDayIndex - weekStart + 7) % 7;
  }

  // ========================================
  // DATE SELECTION LOGIC
  // ========================================

  /**
   * Handle date selection - routes to single or range selection based on mode
   * Updates UI after selection is processed
   *
   * @param {Date} dayDate - Selected date
   */
  selectDate(dayDate) {
    if (this.isRangeAllowed) {
      this.rangeSelect(dayDate);
    } else {
      this.singleSelect(dayDate);
    }

    // Ensure UI reflects current selection state
    this.applySelectionStates();
  }

  /**
   * Handle single date selection
   * Clears previous selection and sets new single date
   *
   * @param {Date} dayDate - Selected date
   */
  singleSelect(dayDate) {
    // Clear any existing selection
    this.clearSelections();

    // Set new single date selection
    this.selectedDates = [dayDate];

    // Notify listeners of single date selection
    this.onSingleSelected(dayDate);
  }

  /**
   * Handle range date selection with complex state management
   * Manages the multi-step process of range selection:
   * 1. First click: Start range
   * 2. Second click: Complete range (or restart if earlier date)
   * 3. Third click: Reset and start new range
   *
   * @param {Date} dayDate - Clicked date
   */
  rangeSelect(dayDate) {
    // If range is complete (2 dates selected), reset and start new range
    if (this.selectedDates.length === 2) {
      this.clearSelections();
      this.selectedDates = [dayDate];
      this.onRangeSelectionReset(this);
      this.onRangeSelectionStart(dayDate, this);
      return;
    }

    // If one date selected, handle second date
    if (this.selectedDates.length === 1) {
      const firstDate = this.selectedDates[0];

      // Ignore click on same date
      if (dayDate.toDateString() === firstDate.toDateString()) {
        return;
      }

      // If second date is earlier, restart range from earlier date
      if (dayDate < firstDate) {
        this.clearSelections();
        this.selectedDates = [dayDate];
        this.onRangeSelectionReset();
        this.onRangeSelectionStart(dayDate, this);
        return;
      }

      // Complete the range selection
      this.selectedDates.push(dayDate);
      this.onRangeSelectionEnd({ from: firstDate, to: dayDate });
      return;
    }

    // First date selection - start new range
    this.clearSelections();
    this.selectedDates = [dayDate];
    this.onRangeSelectionStart(dayDate, this);
  }

  /**
   * Clear all selection states from UI and internal state
   * Removes CSS classes and resets selectedDates array
   */
  clearSelections() {
    // Remove selected styling from all days
    const selected = this.modal.querySelectorAll(".day.selected");
    selected.forEach((el) => el.classList.remove("selected"));

    // Remove in-range styling from all days
    const inRange = this.modal.querySelectorAll(".day.in_range");
    inRange.forEach((el) => el.classList.remove("in_range"));

    // Clear internal selection state
    this.selectedDates = [];
  }

  /**
   * Mark days between two dates as "in range" (visual styling)
   * Used for showing range selection feedback
   *
   * @param {Date} dateA - First date of range
   * @param {Date} dateB - Second date of range
   */
  markRangeBetween(dateA, dateB) {
    if (!dateA || !dateB) return;

    // Ensure correct order regardless of parameter order
    const start = new Date(Math.min(dateA, dateB));
    const end = new Date(Math.max(dateA, dateB));

    // Find all selectable day elements
    const dayElements = this.modal.querySelectorAll(".day:not(.disabled)");

    // Mark days that fall between start and end dates
    dayElements.forEach((el) => {
      const elDate = new Date(el.dataset.date);

      if (elDate > start && elDate < end) {
        el.classList.add("in_range");
      }
    });
  }

  /**
   * Apply current selection states to UI elements
   * Updates CSS classes based on selectedDates array
   * Handles both single selection and range selection display
   */
  applySelectionStates() {
    if (!this.selectedDates.length) return;

    // Get all selectable day elements
    const dayElements = this.modal.querySelectorAll(".day:not(.disabled)");

    let dateA = this.selectedDates[0];
    let dateB = this.selectedDates[1] || null;

    dayElements.forEach((el) => {
      const elDate = new Date(el.dataset.date);

      // Mark explicitly selected dates
      if (
        this.selectedDates.some(
          (sel) => sel.toDateString() === elDate.toDateString()
        )
      ) {
        el.classList.add("selected");
      }

      // Mark dates in range (between selected dates)
      if (dateA && dateB && elDate > dateA && elDate < dateB) {
        el.classList.add("in_range");
      }
    });
  }

  // ========================================
  // GETTER METHODS FOR EXTERNAL ACCESS
  // ========================================

  /**
   * Get currently selected date range
   *
   * @returns {Object|null} Range object with from/to dates, or null if incomplete
   */
  getSelectedRange() {
    if (this.selectedDates.length === 2) {
      return {
        from: new Date(this.selectedDates[0]),
        to: new Date(this.selectedDates[1]),
      };
    }
    return null;
  }

  /**
   * Get all dates within selected range (excluding start/end dates)
   * Useful for highlighting or processing intermediate dates
   *
   * @returns {Date[]|false} Array of dates between selection, or false if no range
   */
  getFullRange() {
    if (this.selectedDates.length !== 2) return false;

    const [start, end] = this.selectedDates;
    const dates = [];

    let current = new Date(start);
    current.setDate(current.getDate() + 1); // Skip start date

    // Collect all dates between start and end
    while (current < end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return dates;
  }

  /**
   * Get first selected date (works for both single and range selection)
   *
   * @returns {Date|null} First selected date or null
   */
  getSelectedDate() {
    return this.selectedDates[0] ? new Date(this.selectedDates[0]) : null;
  }

  /**
   * Get start date of range selection
   *
   * @returns {Date|null} Range start date or null
   */
  getFromDate() {
    return this.selectedDates.length > 0
      ? new Date(this.selectedDates[0])
      : null;
  }

  /**
   * Get end date of range selection
   *
   * @returns {Date|null} Range end date or null
   */
  getToDate() {
    return this.selectedDates.length > 1
      ? new Date(this.selectedDates[1])
      : null;
  }

  // ========================================
  // DATE FORMATTING UTILITIES
  // ========================================

  /**
   * Get human-readable formatted date string
   * Wrapper for formatDate with default format
   *
   * @param {Date} date - Date to format
   * @param {string} [format="d MMM yyyy"] - Format string
   * @returns {string|null} Formatted date string or null
   */
  getReadableDate(date, format = "d MMM yyyy") {
    if (!date) return null;
    return this.formatDate(date, format);
  }

  /**
   * Format date according to custom format string
   * Supports common date format tokens:
   * - dd: Day with leading zero (01, 02, ...)
   * - d: Day without leading zero (1, 2, ...)
   * - MMM: Short month name (Jan, Feb, ...)
   * - MMMM: Full month name (January, February, ...)
   * - MM: Month with leading zero (01, 02, ...)
   * - M: Month without leading zero (1, 2, ...)
   * - yyyy: Full year (2023, 2024, ...)
   * - yy: Two-digit year (23, 24, ...)
   *
   * @param {Date} date - Date to format
   * @param {string} [format="d MMM yyyy"] - Format string with tokens
   * @returns {string} Formatted date string
   */
  formatDate(date, format = "d MMM yyyy") {
    // Map of format tokens to their values
    const map = {
      dd: String(date.getDate()).padStart(2, "0"),
      d: date.getDate(),
      MMM: date.toLocaleString("default", { month: "short" }),
      MMMM: date.toLocaleString("default", { month: "long" }),
      MM: String(date.getMonth() + 1).padStart(2, "0"),
      M: date.getMonth() + 1,
      yyyy: date.getFullYear(),
      yy: String(date.getFullYear()).slice(-2),
    };

    // Replace all tokens in format string with corresponding values
    return format.replace(
      /dd|d|MMMM|MMM|MM|M|yyyy|yy/g,
      (matched) => map[matched]
    );
  }

  /**
   * Get localized day name for a date
   *
   * @param {Date} date - Date to get day name for
   * @param {string} [format="long"] - Format type ("long" or "short")
   * @returns {string} Localized day name (e.g., "Monday" or "Mon")
   * @throws {Error} If invalid date provided
   */
  getDayName(date, format = "long") {
    if (!(date instanceof Date)) {
      throw new Error("getDayName: Invalid date provided.");
    }

    const options = {
      weekday: format === "long" ? "long" : "short",
    };

    return date.toLocaleString("default", options);
  }

  // ========================================
  // MODAL CONTROL METHODS
  // ========================================

  /**
   * Show the datepicker modal
   * Adds 'active' class to make modal visible
   */
  open() {
    this.modal.classList.add("active");
  }

  /**
   * Hide the datepicker modal
   * Removes 'active' class to hide modal
   */
  close() {
    this.modal.classList.remove("active");
  }
}

export default DatePicker;
