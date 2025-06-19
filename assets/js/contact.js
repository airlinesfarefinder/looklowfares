document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact_form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let isValid = true;
    let errors = [];

    // Get fields
    const name = form.querySelector('[name="name"]');
    const subject = form.querySelector('[name="subject"]');
    const contact = form.querySelector('[name="contact_number"]');
    const email = form.querySelector('[name="email"]');
    const message = form.querySelector('[name="message"]');

    // Validate name
    if (!name.value.trim()) {
      isValid = false;
      errors.push("Name is required.");
    }

    // Validate subject
    if (!subject.value.trim()) {
      isValid = false;
      errors.push("Please select a subject.");
    }

    // Validate contact number (10 digits only)
    const contactPattern = /^\d{10}$/;
    if (!contact.value.trim()) {
      isValid = false;
      errors.push("Contact number is required.");
    } else if (!contactPattern.test(contact.value.trim())) {
      isValid = false;
      errors.push("Enter a valid 10-digit contact number.");
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
      isValid = false;
      errors.push("Email is required.");
    } else if (!emailPattern.test(email.value.trim())) {
      isValid = false;
      errors.push("Enter a valid email address.");
    }

    // Validate message
    if (!message.value.trim()) {
      isValid = false;
      errors.push("Message cannot be empty.");
    }

    // Alert errors or submit form
    if (!isValid) {
      alert(errors.join("\n"));
    } else {
      form.submit();
    }
  });
});
