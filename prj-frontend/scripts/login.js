$(document).ready(function () {
    $('#login').submit(function (event) {
        event.preventDefault();
        const email = $('#email').val();
        const password = $('#password').val();

        $.ajax({
            url: 'http://prj-backend/api/auth/login',
            type: 'POST',
            contentType: 'application/json',
            headers: {
                'Accept': 'application/json'
            },
            data: JSON.stringify({ email, password }),
            xhrFields: {
                withCredentials: true // Чтобы куки сессии передавались между фронтом и бэком
            },
            success: function (response, textStatus, xhr) {
                // Проверка на успешный статус 200
                if (xhr.status === 200 && response.redirect_url) {
                    console.log("Response:", response);
                    alert('Вы успешно вошли!');

                    // Сохранение userId в localStorage
                    localStorage.setItem('userId', response.user.id);

                    // Задержка перед редиректом
                    window.location.href = response.redirect_url; // Перенаправление на URL из ответа
                } else {
                    alert('Не удалось выполнить вход. Проверьте свои данные.');
                }
            },
            error: function (error) {
                console.log("Ошибка:", error);
                if (error.responseJSON && error.responseJSON.message) {
                    alert('Ошибка: ' + error.responseJSON.message);
                } else {
                    alert('Произошла неизвестная ошибка.');
                }
            }
        });
    });
});
