const loginForm= document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    $username = $('#username').val();
    $password = $('#password').val();
    fetch('../server/server.php', {
        method: 'POST',
        body: new URLSearchParams({
            username: $username,
            password: $password,
            loc: 'logIn'
        }),
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        if(data.length > 0) {
            const token = generateToken(32);
            localStorage.setItem('userToken', token);
            localStorage.setItem('userName', data[0].name);
            localStorage.setItem('userPos', data[0].position);
            window.location.href = 'index.html';
        } else {
            errorMessage.textContent = 'Invalid username or password';
            $('#username').val('');
            $('#password').val('');
            $('#username').trigger('focus');

        }
    })
    .catch(error => {
        errorMessage.textContent = `Login failed with error code: ${error.message}`;
    });

});
function generateToken(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

if (localStorage.getItem('userToken') !== null) {
    window.location.href = 'index.html';
}

