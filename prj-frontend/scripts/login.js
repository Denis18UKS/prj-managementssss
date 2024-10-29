$(document).ready(function () {
    $('#login').submit(function (event) {
        event.preventDefault();

        $.ajax({
            url: 'http://prj-backend/api/auth/login',
            type: 'POST',
            contentType: 'application/json',
            headers: {
                'Accept': 'application/json'
            },
            data: JSON.stringify({
                email: $('#email').val(),
                password: $('#password').val()
            }),
            xhrFields: {
                withCredentials: true // Чтобы куки сессии передавались между фронтом и бэком
            },
            success: function (response, textStatus, xhr) {
                // Проверка на успешный статус 200
                if (xhr.status === 200 && response.redirect_url) {
                    console.log("Response:", response);
                    alert('Вы успешно вошли! Перенаправление через 2 секунды.');

                    // Задержка перед редиректом
                    setTimeout(function () {
                        window.location.href = response.redirect_url; // Перенаправление на URL из ответа
                    }, 2000); // Задержка в 2 секунды
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
