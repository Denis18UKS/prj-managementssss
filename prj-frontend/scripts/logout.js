// Пример JavaScript для выхода из системы
document.getElementById("logout-button").addEventListener("click", function () {
    fetch('http://prj-backend/logout', {
        method: 'POST',
        credentials: 'include', // чтобы передавать cookie
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                window.location.href = '/'; // перенаправляем на страницу входа
            }
        })
        .catch(error => console.error("Ошибка выхода:", error));
});
