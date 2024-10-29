<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">

    <title>Manager Sidebar</title>
    <style>
        .active {
            background-color: black;
            font-weight: bold;
            /* Можно изменить стиль для активного элемента */
            color: whitesmoke;
            border-radius: 8px;
            /* Или изменить цвет текста */
        }
    </style>
</head>

<body>

    <nav class="nav">
        <div class="nav__logo">
            <p class="nav__logo-text">Название</p>
        </div>
        <div class="nav__menu">
            <p class="nav__menu-text">Меню</p>
            <ul class="nav__menu-list">
                <li class="nav__menu-item">
                    <a class="nav__menu-item-link <?php echo (basename($_SERVER['PHP_SELF']) === 'admin.php') ? 'active' : ''; ?>" href="admin.php">Главная</a>
                </li>
                <li class="nav__menu-item">
                    <a class="nav__menu-item-link <?php echo (basename($_SERVER['PHP_SELF']) === 'users.php') ? 'active' : ''; ?>" href="users.php">Пользователи</a>
                </li>
                <li class="nav__menu-item">
                    <a class="nav__menu-item-link <?php echo (basename($_SERVER['PHP_SELF']) === 'tasks.php') ? 'active' : ''; ?>" href="tasks.php">Задачи</a>
                </li>
                <li class="nav__menu-item">
                    <a class="nav__menu-item-link <?php echo (basename($_SERVER['PHP_SELF']) === 'reports.php') ? 'active' : ''; ?>" href="reports.php">Отчёты</a>
                </li>
            </ul>

        </div>
        <button class="btn btn-dark" id="logout-button">Выйти</button>

    </nav>

    <script>
        document.getElementById("logout-button").addEventListener("click", function() {
            fetch('http://prj-backend/logout', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.message) {
                        alert(data.message);
                        window.location.href = '/';
                    }
                })
                .catch(error => console.error("Ошибка выхода:", error));
        });
    </script>

</body>

</html>