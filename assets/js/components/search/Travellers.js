class Travellers {
  modal = null;
  traveller_type = {};
  travel_classes = ["economy", "premium economy", "business", "first class"];
  isGroup = false;
  selectedTravelClass = "economy";

  constructor(options) {
    if (!options.modal) {
      throw new Error(`Travellers: Missing required modal element`);
    }

    this.modal = options.modal;

    if (
      options.defaultSelectedTravelClass &&
      this.travel_classes.includes(
        options.defaultSelectedTravelClass.toLowerCase()
      )
    ) {
      this.selectedTravelClass =
        options.defaultSelectedTravelClass.toLowerCase();
    }

    // traveller update
    if (typeof options.onTravellerCountUpdate === "function") {
      this.onTravellerCountUpdate = options.onTravellerCountUpdate;
    }

    // group selected
    if (typeof options.onGroupSelected === "function") {
      this.onGroupSelected = options.onGroupSelected;
    }

    // done
    if (typeof options.onDone === "function") {
      this.onDone = options.onDone;
    }

    // on selected
    if (typeof options.onSelectedTravelClass === "function") {
      this.onSelectedTravelClass = options.onSelectedTravelClass;
    }

    // on ready
    if (typeof options.onReady === "function") {
      this.onReady = options.onReady;
    }

    this.populate_modal();

    if (this.onReady) {
      this.onReady(this);
    }
  }

  populate_modal() {
    this.populate_travellers_count();
    this.populate_isGroup();
    this.populate_classes();

    let done_button = document.createElement("button");
    done_button.classList = "button";
    done_button.textContent = "Done";

    done_button.addEventListener("click", () => {
      if (this.onDone) {
        this.onDone({
          travellers: this.getTravellerCounts(),
          travelClass: this.getSelectedTravelClass(),
          isGroup: this.isGroup,
        });
      }
    });

    this.modal.append(done_button);
  }

  populate_travellers_count() {
    let traveller_count = document.createElement("div");
    traveller_count.className = "traveller_count";

    traveller_count.append(this.getTravellerType("adults", "12+ years", 0));

    traveller_count.append(
      this.getTravellerType("children", "(2-12 years)", 0)
    );

    traveller_count.append(this.getTravellerType("infants", "(0-2 years)", 0));

    this.modal.append(traveller_count);
  }

  getTravellerType(label, range, count = 0) {
    const wrapper = document.createElement("div");
    wrapper.className = "item_wrapper";

    const item = document.createElement("div");
    item.className = "item";

    const title = document.createElement("div");
    title.className = "title";
    title.innerHTML = `${label} <span class="sub"> ${range} </span>`;

    const selectionBox = document.createElement("div");
    selectionBox.className = "selection_box";

    const minus = document.createElement("div");
    minus.className = "control minus";

    const value = document.createElement("div");
    value.className = "value";
    value.textContent = count;

    const plus = document.createElement("div");
    plus.className = "control plus";

    // adding event listeners
    minus.addEventListener("click", () => {
      this.decreaseTravellerCount(label);
    });

    plus.addEventListener("click", () => {
      this.increaseTravellerCount(label);
    });

    selectionBox.appendChild(minus);
    selectionBox.appendChild(value);
    selectionBox.appendChild(plus);

    item.appendChild(title);
    item.appendChild(selectionBox);
    wrapper.appendChild(item);

    // updating registry
    this.traveller_type[label] = {
      value: count,
      valueEl: value,
    };

    return wrapper;
  }

  populate_isGroup() {
    let is_group = document.createElement("div");
    is_group.className = "is_group";

    is_group.innerHTML = `<div class="checkbox checked"></div>
                          <div class="text">More than 9 travellers</div>
                          <div class="icon"></div>`;

    is_group.addEventListener("click", () => {
      this.toggleGroup(is_group);
    });

    this.modal.append(is_group);
  }

  populate_classes() {
    let travel_class = document.createElement("ul");
    travel_class.className = "travel_class";

    for (let i = 0; i < this.travel_classes.length; i++) {
      let class_li = document.createElement("li");
      const travelClass = this.travel_classes[i];
      class_li.textContent = travelClass;
      class_li.dataset.travel_class = travelClass;

      // mark as selected if it matches selectedTravelClass
      if (travelClass === this.selectedTravelClass) {
        class_li.classList.add("selected");
      }

      class_li.addEventListener("click", () => {
        this.selectTravelClass(class_li, travel_class);
      });

      travel_class.append(class_li);
    }

    this.modal.append(travel_class);
  }

  increaseTravellerCount(type) {
    if (type !== "infants") {
      let total_travellers =
        this.traveller_type["adults"].value +
        this.traveller_type["children"].value;
      if (total_travellers === 9) {
        return;
      }
    }

    if (type === "infants") {
      if (
        this.traveller_type[type].value === this.traveller_type["adults"].value
      ) {
        return;
      }
    }

    this.traveller_type[type].value++;
    this.update_traveller_count(type);
  }

  decreaseTravellerCount(type) {
    if (type === "adults") {
      if (this.traveller_type[type].value < 2) {
        return;
      }
    }

    if (type !== "adults") {
      if (this.traveller_type[type].value < 1) {
        return;
      }
    }

    this.traveller_type[type].value--;
    this.update_traveller_count(type);
  }

  update_traveller_count(type) {
    this.traveller_type[type].valueEl.textContent =
      this.traveller_type[type].value;

    if (this.onTravellerCountUpdate) {
      this.onTravellerCountUpdate(this.getTravellerCounts());
    }
  }

  toggleGroup(ele) {
    if (!this.isGroup) {
      ele.classList.add("checked");
      this.isGroup = true;

      if (this.onGroupSelected) {
        this.onGroupSelected(this.isGroup);
      }
    } else {
      ele.classList.remove("checked");
      this.isGroup = false;
    }
  }

  selectTravelClass(li, ul) {
    let lis = ul.getElementsByTagName("LI");

    for (let i = 0; i < lis.length; i++) {
      lis[i].classList.remove("selected");
    }

    li.classList.add("selected");

    // updating registry
    this.selectedTravelClass = li.dataset.travel_class;

    // firing callback
    if (this.onSelectedTravelClass) {
      this.onSelectedTravelClass(this.selectedTravelClass);
    }
  }

  // ======= GETTERS ===== //
  getTravellerCounts() {
    const adults = this.traveller_type["adults"]?.value || 0;
    const children = this.traveller_type["children"]?.value || 0;
    const infants = this.traveller_type["infants"]?.value || 0;

    let total = adults + children + infants;

    return {
      total: total,
      adults,
      children,
      infants,
    };
  }

  getSelectedTravelClass() {
    return this.selectedTravelClass;
  }

  open() {
    this.modal.classList.add("active");
  }

  close() {
    this.modal.classList.remove("active");
  }
}

export default Travellers;
