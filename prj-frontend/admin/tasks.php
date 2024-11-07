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
    <script src="../scripts/tasks.js" defer></script>
</head>

<body>
    <?php include 'admin-sidebar.php'; ?> <!-- Включаем навигационную панель -->

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
            <button class="add_user_btn" id="createTaskBtn">Создать задачу</button>
            <div id="taskList" class="tasks__list"></div>
        </div>
    </div>

    <!-- Модальное окно создания задачи -->
    <div id="createTaskModal" class="modal">
        <div class="modal-content">
            <span class="close" id="closeTaskModal">&times;</span>
            <h2>Создать задачу</h2>


            <label for="taskName">Название задачи:</label>
            <input type="text" id="taskName" placeholder="Название задачи" required>

            <label for="taskDescription">Описание задачи</label>
            <textarea id="taskDescription" placeholder="Описание задачи" rows="4"></textarea>

            <label for="startDate">Дата начала:</label>
            <input type="date" id="startDate" required>

            <label for="endDate">Дата окончания:</label>
            <input type="date" id="endDate" required>

            <label for="projectPriority">Приоритет</label>
            <select id="projectPriority">
                <option value="Низкий">Низкий</option>
                <option value="Средний">Средний</option>
                <option value="Высокий">Высокий</option>
            </select>

            <label for="projectSelect">Выберите проект:</label>
            <select id="projectSelect" required></select>

            <button id="confirmCreateTaskBtn">Создать задачу</button>
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

            <label for="editProjectPriority">Приоритет</label>
            <select id="editProjectPriority">
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