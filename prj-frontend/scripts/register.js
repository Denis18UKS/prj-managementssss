$(document).ready(function () {
    $('#register').submit(function (event) {
        event.preventDefault();
        console.log("Форма отправлена"); // Проверка, срабатывает ли обработчик

        $.ajax({
            url: 'http://prj-backend/api/auth/register',
            type: 'POST',
            data: {
                name: $('#username').val(),
                email: $('#email').val(),
                password: $('#password').val()
            },
            success: function (response) {
                console.log("Успех:", response);
                alert('Регистрация успешна!'); // Добавлено для информирования о успехе
            },
            error: function (error) {
                console.log("Ошибка:", error); // Проверка, сработает ли обработчик ошибок
                if (error.responseJSON) {
                    alert('Ошибка при регистрации: ' + JSON.stringify(error.responseJSON));
                } else {
                    alert('Произошла неизвестная ошибка.');
                }
            }
        });
    });
});
