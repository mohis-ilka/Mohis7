document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const contact = document.getElementById('contact').value;
    const message = document.getElementById('message').value;

    fetch('http://localhost:3000/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            contact: contact,
            message: message
        })
    })
    .then(response => response.text())
    .then(result => {
        console.log(result);
        alert('پیام با موفقیت ارسال شد');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('خطا در ارسال پیام');
    });
});

console.log('Server running at http://localhost:3000/');