<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Проекты & Задачи</title>
    <link rel="stylesheet" href="../styles/main.css">
    <link rel="stylesheet" href="../styles/user.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="../scripts/admin.js" defer></script>
</head>

<body>
    <?php include 'admin-sidebar.php'; ?>

    <div class="container">
        <div class="filter">
            <form class="filter__search" action="" method="get" id="search-form">
                <input name="search" class="filter__search-input" type="text" placeholder="Найти пользователя" id="search-input">
            </form>

            <div class="filter__roles">
                <button class="filter__priority" data-role="manager">Руководители проектов</button>
                <button class="filter__priority" data-role="user">Исполнители</button>
                <button class="filter__reset" id="reset-filters">Сбросить фильтры</button>
            </div>

            <div class="notifications">
                <img class="notifications-top" src="../images/notification-top.svg" alt="">
                <img class="notifications-bottom" src="../images/notification-bottom.svg" alt="">
            </div>
            <a class="filter__user-icon" href="account.php">
                <img src="../images/account-icon.png" alt="Профиль" class="filter__user-icon-img">
            </a>
        </div>

        <button class="add_user_btn" onclick="window.location.href='register.php'">Регистрация пользователя</button>
        <section class="projects">
            <h2 class="title">Пользователи</h2>
            <div class="projects__cards" id="user-cards"></div>
        </section>
    </div>

    <!-- Модальное окно для редактирования пользователя -->
    <div id="editUserModal" style="display:none;">
        <h3>Редактировать пользователя</h3>
        <input type="text" id="editUserName" placeholder="Имя пользователя" required>
        <input type="email" id="editUserEmail" placeholder="Email" required>
        <label for="editUserRole">Роль:</label>
        <select id="editUserRole">
            <option value="admin">админ</option>
            <option value="user">исполнитель</option>
            <option value="manager">менеджер</option>
        </select>
        <button id="saveUserChanges">Сохранить изменения</button>
        <button id="closeModal">Закрыть</button>
    </div>

    <script></script>
</body>

</html>