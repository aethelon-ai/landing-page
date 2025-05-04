document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    // --- !!! REPLACE THESE PLACEHOLDERS !!! ---
    const GOOGLE_FORM_ACTION_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfdUxLBjC7ZBvJ34TKtCdcYrHekuImF5S3O6Kjmt1EdUaldpQ/formResponse'; // <-- Replace with your Form Action URL
    const NAME_ENTRY_ID = 'entry.1457358515';   // <-- Replace with Name field's 'entry.XYZ' ID
    const EMAIL_ENTRY_ID = 'entry.858502823';  // <-- Replace with Email field's 'entry.XYZ' ID
    const MESSAGE_ENTRY_ID = 'entry.1719958018';// <-- Replace with Message field's 'entry.XYZ' ID
    // --- !!! END OF PLACEHOLDERS !!! ---

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the default form submission

            const nameValue = document.getElementById('name').value;
            const emailValue = document.getElementById('email').value;
            const messageValue = document.getElementById('message').value;

            // Use FormData to structure the data for Google Forms
            const formData = new FormData();
            formData.append(NAME_ENTRY_ID, nameValue);
            formData.append(EMAIL_ENTRY_ID, emailValue);
            formData.append(MESSAGE_ENTRY_ID, messageValue);

            // Disable button temporarily to prevent multiple submissions
            const submitButton = contactForm.querySelector('.btn-submit');
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            formStatus.textContent = ''; // Clear previous status

            // Send the data to Google Forms using fetch
            fetch(GOOGLE_FORM_ACTION_URL, {
                method: 'POST',
                mode: 'no-cors', // IMPORTANT: Google Forms doesn't allow CORS requests from browsers directly,
                               // so we won't get a proper success response back in the script,
                               // but the data *should* still be submitted.
                body: formData,
            })
            .then(() => {
                // Because of 'no-cors', we can't reliably know if it succeeded here.
                // We just assume it did if fetch didn't throw an error.
                formStatus.textContent = 'Message sent successfully!';
                formStatus.style.color = 'var(--primary-accent)';
                contactForm.reset(); // Clear the form
            })
            .catch(error => {
                // This usually catches network errors, not submission errors from Google.
                console.error('Error submitting form:', error);
                formStatus.textContent = 'Oops! There was a network problem submitting your form.';
                formStatus.style.color = 'red';
            })
            .finally(() => {
                 // Re-enable button regardless of outcome
                 submitButton.disabled = false;
                 submitButton.textContent = 'Send Message';
                 // Optionally clear the success/error message after a delay
                 setTimeout(() => { formStatus.textContent = ''; }, 5000);
            });
        });
    }
});