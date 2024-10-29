$(document).ready(function () {
    let users = []; // Массив для хранения пользователей

    // Загрузка пользователей
    function loadUsers() {
        $.ajax({
            url: 'http://prj-backend/users',
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                users = data; // Сохраняем пользователей в массив
                displayUsers(users); // Отображаем всех пользователей
            },
            error: function (xhr, status, error) {
                console.error("Ошибка при загрузке пользователей:", error);
            }
        });
    }

    // Функция для отображения пользователей
    function displayUsers(filteredUsers) {
        $('#user-cards').empty(); // Очистка списка пользователей

        if (filteredUsers.length === 0) {
            $('#user-cards').append(`<div class="no-users">Пользователи не найдены</div>`);
            return; // Выход из функции, если пользователей нет
        }

        filteredUsers.forEach(function (user) {
            const roles = user.roles.length ? user.roles.map(role => role.name).join(', ') : 'user';
            $('#user-cards').append(`
                <div class="projects__card">
                    <div class="projects__card-title">${user.name}</div>
                    <div class="projects__card-manager">${user.email}</div>
                    <div class="projects__card-role">Роль: ${roles}</div>
                    <div id="btns">
                        <button class="edit_btn" data-id="${user.id}">Редактировать</button>
                        <button class="delete_btn" data-id="${user.id}">Удалить</button>
                    </div>
                </div>
            `);
        });
    }

    // Открытие модального окна редактирования
    $('#user-cards').on('click', '.edit_btn', function () {
        const userId = $(this).data('id');
        $.ajax({
            url: `http://prj-backend/users/${userId}`,
            method: 'GET',
            dataType: 'json',
            success: function (user) {
                $('#editUserName').val(user.name);
                $('#editUserEmail').val(user.email);
                const userRole = user.roles.length > 0 ? user.roles[0].name : 'user';
                $('#editUserRole').val(userRole);
                $('#editUserModal').show();
                $('#saveUserChanges').data('id', userId);
            },
            error: function (xhr, status, error) {
                console.error("Ошибка при загрузке пользователя:", error);
            }
        });
    });

    // Обработчик кнопки удаления
    $('#user-cards').on('click', '.delete_btn', function () {
        const userId = $(this).data('id');
        if (confirm("Вы уверены, что хотите удалить пользователя?")) {
            $.ajax({
                url: `http://prj-backend/users/${userId}`,
                method: 'DELETE',
                success: function () {
                    alert("Пользователь успешно удалён.");
                    loadUsers(); // Перезагружаем список пользователей
                },
                error: function (xhr, status, error) {
                    console.error("Ошибка при удалении пользователя:", error);
                    alert('Ошибка при удалении пользователя.');
                }
            });
        }
    });

    // Сохранение изменений пользователя
    $('#saveUserChanges').on('click', function () {
        const userId = $(this).data('id');
        const updatedUser = {
            name: $('#editUserName').val(),
            email: $('#editUserEmail').val(),
            role: $('#editUserRole').val()
        };

        $.ajax({
            url: `http://prj-backend/users/${userId}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(updatedUser),
            success: function () {
                $.post(`http://prj-backend/users/${userId}/assign-role`, {
                    role: updatedUser.role
                })
                    .done(function () {
                        alert('Данные пользователя и роль успешно обновлены.');
                        $('#editUserModal').hide();
                        loadUsers(); // Перезагружаем список пользователей
                    })
                    .fail(function (xhr, status, error) {
                        console.error("Ошибка при назначении роли:", error);
                        alert('Ошибка при назначении роли.');
                    });
            },
            error: function (xhr, status, error) {
                console.error("Ошибка при обновлении пользователя:", error);
                alert('Ошибка при обновлении пользователя.');
            }
        });
    });

    // Закрытие модального окна
    $('#closeModal').on('click', function () {
        $('#editUserModal').hide();
    });

    // Поиск пользователей
    $('#search-form').on('submit', function (e) {
        e.preventDefault(); // Предотвратить перезагрузку страницы
        const searchValue = $('#search-input').val().toLowerCase();
        const filteredUsers = users.filter(user =>
            user.name.toLowerCase().includes(searchValue) ||
            user.email.toLowerCase().includes(searchValue)
        );
        displayUsers(filteredUsers);
    });

    // Фильтрация по ролям
    $('.filter__priority').on('click', function () {
        const role = $(this).data('role');
        const filteredUsers = users.filter(user => {
            const roles = user.roles.map(r => r.name);
            return roles.includes(role);
        });
        displayUsers(filteredUsers);
    });

    // Сбросить фильтры
    $('#reset-filters').on('click', function () {
        $('#search-input').val(''); // Очистить поле поиска
        displayUsers(users); // Вернуть всех пользователей
    });

    // Загрузка пользователей при старте
    loadUsers();
});






