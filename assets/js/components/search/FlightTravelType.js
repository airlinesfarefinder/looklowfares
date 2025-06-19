class FlightTravelType {
  wrapper = null;
  selectedFlightTravelTypeOption = "one way";
  flightTravelTypeOptions = [];

  constructor(options) {
    if (!options.wrapper) {
      throw new Error(`FlightTravelType: Missing required wrapper element`);
    }

    this.wrapper = options.wrapper;

    // traveller update
    if (typeof options.onUpdate === "function") {
      this.onUpdate = options.onUpdate;
    }

    this.flightTravelType(this.wrapper);
  }

  flightTravelType(wrapper) {
    let optionLi = wrapper.getElementsByTagName("LI");

    for (let i = 0; i < optionLi.length; i++) {
      optionLi[i].addEventListener("click", () => {
        this.toggleFlightTravelType(optionLi[i]);
      });
    }

    this.flightTravelTypeOptions = optionLi;
  }

  toggleFlightTravelType(targetEle) {
    let optionLi = this.flightTravelTypeOptions;

    for (let i = 0; i < optionLi.length; i++) {
      optionLi[i].classList.remove("active");
    }

    targetEle.classList.add("active");
    this.selectedFlightTravelTypeOption = targetEle.dataset.option;

    if (this.onUpdate) {
      this.onUpdate(this.getTravelType());
    }
  }

  getTravelType() {
    return this.selectedFlightTravelTypeOption;
  }
}

export default FlightTravelType;
