document.getElementById('contactButton').addEventListener('click', function(e) {
    e.preventDefault(); // Prevents the default mailto action
    const email = 'geronimowoodworks@gmail.com';
    
    navigator.clipboard.writeText(email).then(() => {
        // Change tooltip text to indicate the email was copied
        const tooltip = document.getElementById('tooltip');
        tooltip.textContent = 'Email Copied!';
        tooltip.style.marginLeft = 10 + 'px';
        
        // Reset the tooltip text after 2 seconds
        setTimeout(() => {
            tooltip.textContent = 'Copy Email';
            tooltip.style.marginLeft = 18 + 'px';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy email:', err);
    });
});
