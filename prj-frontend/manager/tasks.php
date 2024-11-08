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
    <script src="../scripts/tasks_for_managers.js" defer></script>
</head>

<body>
    <?php include 'manager-sidebar.php'; ?> <!-- Включаем навигационную панель -->

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
            <h2 class="tasks__header-title">Задачи</h2>
            <div id="taskList" class="tasks__list"></div>
        </div>
    </div>

    <!-- Модальное окно редактирования задачи -->
    <div id="editTaskModal" class="modal">
        <div class="modal-content">
            <span class="close" id="closeEditTaskModal">&times;</span>
            <h2>Редактировать задачу</h2>

            <input type="text" id="editTaskName" placeholder="Название задачи" required>
            <textarea id="editTaskDescription" placeholder="Описание задачи" rows="4"></textarea>

            <label for="editTaskStartDate">Дата начала:</label>
            <input type="date" id="editTaskStartDate" required>

            <label for="editTaskEndDate">Дата окончания:</label>
            <input type="date" id="editTaskEndDate" required>

            <label for="editTaskStatus">Статус</label>
            <select id="editTaskStatus" disabled>
                <option value="Создан">Создан</option>
                <option value="Выполняется">В процессе</option>
                <option value="Завершена">Завершенные</option>
            </select>

            <label for="editTaskPriority">Приоритет</label>
            <select id="editTaskPriority">
                <option value="Низкий">Низкий</option>
                <option value="Средний">Средний</option>
                <option value="Высокий">Высокий</option>
            </select>

            <label for="editTaskProject">Выберите проект:</label>
            <select id="editTaskProject" required></select>

            <button id="confirmEditTaskBtn">Сохранить изменения</button>
        </div>
    </div>
</body>

</html>