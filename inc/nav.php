<div id="nav">
    <div class="container-fluid">
        <div class="row">
            <div class="inner">
                <div class="container">
                    <div style="position:relative" class="row">
                        <div class="col-sm-3 col-xs-5">
                            <a href="index.php">
                                <div class="logo"></div>
                            </a>
                        </div>
                        <div class="col-sm-6">
                            <div id="nav_menu" class="menu">
                                <ul class="clearfix">
                                    <li><a href="index.php">Home</a></li>
                                    <li><a href="index.php#top_flights">Flight Deals</a></li>
                                    <li><a href="index.php#grid">Tours</a></li>
                                    <li><a href="about-us.php">About Us</a></li>
                                    <li><a href="contact-us.php">Contact Us</a></li>
                                </ul>
                            </div>
                        </div>

                        <a href="tel:<?php echo config('phone_number'); ?>">
                            <div class="nav_call">
                                <div class="inner">
                                    <span class="icon"></span>
                                    <div class="text">
                                        <span class="title">Call 24/7 for our best deals</span>
                                        <span class="phone_number"><?php echo config('phone_number'); ?></span>
                                    </div>
                                </div>
                            </div>
                        </a>

                        <div id="nav_toggle" onclick="toggle_nav()"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>