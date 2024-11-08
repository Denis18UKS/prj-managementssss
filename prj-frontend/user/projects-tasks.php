<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Главная</title>
    <link rel="stylesheet" href="../styles/main.css">
    <link rel="stylesheet" href="../styles/user.css">
    <script src="https://code.jquery.com/jquery-3.7.1.min.js" defer></script>
    <script src="../scripts/logout.js" defer></script>
    <script src="../scripts/tasks_for_user.js" defer></script>
</head>

<body>
    <?php include 'user-sidebar.php'; ?> <!-- Включаем навигационную панель -->

    <div class="container">
        <div class="filter">
            <button class="btn btn-danger filter-btn" data-priority="Высокий">Высокий приоритет</button>
            <button class="btn btn-warning filter-btn" data-priority="Средний">Средний приоритет</button>
            <button class="btn btn-success filter-btn" data-priority="Низкий">Низкий приоритет</button>

            <!-- Фильтры по статусу -->
            <button class="btn btn-info status-filter-btn" data-status="Выполняется">В процессе</button>
            <button class="btn btn-success status-filter-btn" data-status="Завершена">Завершенные</button>
            <button class="btn btn-dark status-filter-btn" data-status="">Сбросить</button> <!-- Для сброса фильтра -->
        </div>

        <div class="projects">
            <div class="tasks__cards"></div>

            <h2 class="tasks__header-title">Задачи</h2>
            <div id="taskList" class="tasks__list"></div>
        </div>
    </div>

</body>

</html>