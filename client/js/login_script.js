const token = localStorage.getItem('userToken');
fetch('../server/token_check.php', {
    method: 'POST',
    body: new URLSearchParams({
        token: token,
    }),
})
.then(response => {
    if (response.ok) {
        window.location.href = 'index.html';
    }
})
.catch(error => {
    console.error('Error:', error);
});

const loginForm= document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    $username = $('#username').val();
    $password = $('#password').val();
    login($username, $password);
});

function login(username, password){
    fetch('../server/login_server.php', {
        method: 'POST',
        body: new URLSearchParams({
            username: username,
            password: password
        }),
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        if(data.length > 0) {
            localStorage.setItem('userToken', data[0].token);
            localStorage.setItem('userName', data[0].name);
            localStorage.setItem('userPos', data[0].position);
            window.location.href = 'index.html';
        } else {
            errorMessage.textContent = data.error;
            $('#username').val('');
            $('#password').val('');
            $('#username').trigger('focus');
        }
    })
    .catch(error => {
        errorMessage.textContent = `Login failed with error code: ${error.message}`;
    });
}


/*
if (localStorage.getItem('userToken') !== null) {
    window.location.href = 'index.html';
}
*/

