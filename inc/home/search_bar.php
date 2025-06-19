<div class="search_wrapper">
    <div id="search_form" class="clearfix">

        <!-- flight search tab -->
        <div id="search_flights">
            <div class="container-fluid">
                <div class="row">
                    <ul id="travel_types" class="travel_type clearfix">
                        <li data-option="oneway">one way</li>
                        <li class="active" data-option="roundtrip">round trip</li>
                    </ul>
                </div>
                <div class="row">

                    <!-- contents -->
                    <div class="content">
                        <div class="container-fluid">
                            <div class="row">
                                <!-- Airports -->
                                <div class="airports col-sm-6">
                                    <div class="reverser"></div>
                                    <div class="container-fluid">
                                        <div class="row">
                                            <div class="col-sm-6">
                                                <div id="from_airport" class="input_holder">
                                                    <div class="title">FROM</div>
                                                    <div class="excerpt">From</div>
                                                    <div class="text">search airport or city
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-sm-6">
                                                <div id="to_airport" class="input_holder">
                                                    <div class="title">TO</div>
                                                    <div class="excerpt">To</div>
                                                    <div class="text">search airport or city
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- modal -->
                                            <div id="from_airport_search_modal" class="airport_search_modal"></div>
                                            <div id="to_airport_search_modal" class="airport_search_modal"></div>
                                            <!-- modal -->
                                        </div>
                                    </div>
                                </div>
                                <!-- Airports -->

                                <!-- Departure Date, Return Date, Traveller & Class -->
                                <div class="col-sm-6">
                                    <div class="container-fluid">
                                        <div id="date_section" class="row">
                                            <div class="col-sm-4">
                                                <div id="departure_date" class="input_holder">
                                                    <div class="title">Departure Date</div>
                                                    <div class="excerpt">--</div>
                                                    <div class="text">--</div>
                                                </div>
                                            </div>
                                            <div class="col-sm-4">
                                                <div id="return_date" class="input_holder">
                                                    <div class="title">Return Date</div>
                                                    <div class="excerpt">--</div>
                                                    <div class="text">--</div>
                                                </div>
                                            </div>
                                            <div class="col-sm-4">
                                                <div id="traveller_class" class="input_holder">
                                                    <div class="title">Traveller & Class</div>
                                                    <div class="excerpt">1 Traveller</div>
                                                    <div class="text">Economy</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Departure Date, Return Date, Traveller & Class -->
                            </div>
                        </div>
                    </div>
                    <div class="content">
                        <div class="container-fluid">
                            <div class="row">
                                <div class="col-sm-4">
                                    <div class="input_wrapper">
                                        <label for="">Your Name</label>
                                        <input name="name" class="extra_input" type="text" placeholder="Your Name">
                                    </div>
                                </div>
                                <div class="col-sm-4">
                                    <div class="input_wrapper">
                                        <label for="">Contact Number</label>
                                        <input name="contact" class="extra_input" type="text" placeholder="Your Contact Number">
                                    </div>
                                </div>
                                <div class="col-sm-4">
                                    <div class="input_wrapper">
                                        <label for="">Email ID</label>
                                        <input name="email" class="extra_input" type="text" placeholder="Your Email Id">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- contents -->

                    <!-- Calendar Modal -->
                    <div id="calendar_modal"></div>
                    <!-- Calendar Modal -->

                    <!-- Traveller Modal -->
                    <div id="traveller_modal"></div>
                    <!-- Traveller Modal -->

                    <!-- Search Button -->
                    <div class="button_wrapper">
                        <button id="search_button" class="button">
                            <span class="icon"></span>
                            Search
                        </button>
                    </div>

                </div>
                <div class="row">

                </div>
            </div>
        </div>
        <!-- flight search tab -->

    </div>
</div>