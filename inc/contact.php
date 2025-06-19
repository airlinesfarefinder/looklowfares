<div id="small_banner" style="background-image:url('assets/img/450.jpg')">
    <div class="container">
        <div class="row">
            <div class="col-sm-6">
                <div class="head">
                    <h3>Contact Us</h3>
                    <p>Have questions or need assistance? We're here to help! Reach out to our team
                        for inquiries, support, or personalized travel guidance—anytime you need us.</p>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="contact-us">
    <div class="container">
        <div class="row infobox_big">
            <div class="col-sm-4">
                <div class="item">
                    <span class="icon" style="background-image:url('assets/img/pin.png')">
                    </span>
                    <span class="title">visit us</span>
                    <span class="excerpt"><?php echo config('address'); ?></span>
                </div>
            </div>
            <div class="col-sm-4">
                <div class="item" id="contact_form">
                    <span class="icon" style="background-image:url('assets/img/chatting.png')">
                    </span>
                    <span class="title">Mail Us</span>
                    <span class="excerpt">
                        <?php echo config('email_id'); ?>
                    </span>
                </div>
            </div>
            <div class="col-sm-4">
                <div class="item" id="contact_form">
                    <span class="icon" style="background-image:url('assets/img/telephone.png')">
                    </span>
                    <span class="title">Call Us</span>
                    <span class="excerpt">
                        <?php echo config('phone_number'); ?>
                    </span>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-6">
                <div style="padding-top:15px;border-radius:25px;overflow:hidden">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.563775050381!2d-0.11171712418833372!3d51.521218609694785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761b4e8c0a212f%3A0xb24ec4c9365c737!2s156%20b%2C%20Colonial%20Buildings%2C%2062%20Hatton%20Garden%2C%20London%20EC1N%208LR%2C%20UK!5e0!3m2!1sen!2sin!4v1750338577186!5m2!1sen!2sin"
                        width="100%" height="420" frameborder="0" style="border:0" allowfullscreen=""></iframe>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="card_wrapper">
                    <form class="card layer1" action="contactmail.php" method="post">
                        <div class="container-fluid">
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="input_group">
                                        <input class="input" type="text" name="name" value="" required="">
                                        <label for="">your name</label>
                                        <span class="highlight"></span>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="input_group">
                                        <select class="input" name="subject">
                                            <option value="">Select</option>
                                            <option value="Cruise">Cruise</option>
                                            <option value="Flights">Flights</option>
                                            <option value="Packages">Packages</option>
                                            <option value="Others">Others</option>
                                        </select>
                                        <label for="">query for</label>
                                        <span class="highlight"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="input_group">
                                        <input class="input" type="text" name="contact_number" value="" required=""
                                            placeholder="">
                                        <label for="">your contact number</label>
                                        <span class="highlight"></span>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="input_group">
                                        <input class="input" type="text" name="email" value="" required=""
                                            placeholder="">
                                        <label for="">your email</label>
                                        <span class="highlight"></span>
                                    </div>
                                </div>
                                <div class="col-sm-12">
                                    <div class="input_group">
                                        <textarea class="input" name="message" rows="5"></textarea>
                                        <label for="" class="">your message</label>
                                        <span class="highlight"></span>
                                    </div>
                                </div>
                                <div class="col-sm-12">
                                    <div class="input_group">
                                        <button style="width:100%" class="button pink" type="submit"
                                            name="button">send</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <br><br><br>
    </div>
</div>