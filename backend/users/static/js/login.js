document.querySelector('.login-button').addEventListener('click', async () => {
    const username = document.querySelector('.email-input').value;
    const password = document.querySelector('.password-input').value;

    const response = await fetch('http://127.0.0.1:8000/api/users/login-page/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('username', data.user.username);
        alert("Login successful!");
        window.location.href = "/for_diploma/home/home.html";
    } else {
        alert("Invalid credentials. Please try again.");
    }
});
