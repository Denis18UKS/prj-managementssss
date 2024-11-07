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
    <script src="../scripts/projects.js" defer></script>
    <script src="../scripts/tasks.js" defer></script>
</head>

<body>
    <?php include 'admin-sidebar.php'; ?> <!-- Включаем навигационную панель -->

    <div class="container">
        <div class="filter">
            <button class="btn btn-danger filter-btn" data-priority="high">Высокий приоритет</button>
            <button class="btn btn-warning filter-btn" data-priority="medium">Средний приоритет</button>
            <button class="btn btn-success filter-btn" data-priority="low">Низкий приоритет</button>
            <button class="btn btn-dark filter-btn" data-end-date="near">Близкий конец срока</button>
        </div>


        <div class="projects">
            <div class="projects__header">
                <h2 class="projects__header-title">Проекты</h2>
                <button class="add_user_btn" id="createProjectBtn">Создать проект</button>
            </div>

            <div class="tasks__cards"></div>

            <h2 class="tasks__header-title">Задачи</h2>
            <button class="add_user_btn" id="createTaskBtn">Создать задачу</button>
            <div id="taskList" class="tasks__list"></div>
        </div>
    </div>

    <!-- Модальное окно редактирования проекта -->
    <div id="editProjectModal" class="modal">
        <div class="modal-content">
            <span class="close" id="closeEditProjectModal">&times;</span>
            <h2>Редактировать проект</h2>

            <label for="editProjectName">Название проекта</label>
            <input type="text" id="editProjectName" placeholder="Название проекта" required>

            <label for="editProjectDescription">Описание проекта</label>
            <textarea id="editProjectDescription" placeholder="Описание проекта" rows="4"></textarea>

            <label for="editProjectStartDate">Дата начала:</label>
            <input type="date" id="editProjectStartDate" required>

            <label for="editProjectEndDate">Дата окончания:</label>
            <input type="date" id="editProjectEndDate" required>

            <label for="editProjectStatus">Статус проекта</label>
            <select id="editProjectStatus" disabled>
                <option value="created">Создан</option>
                <option value="in_progress">В процессе</option>
                <option value="completed">Завершён</option>
            </select>

            <label for="editProjectManager">Руководители</label>
            <select id="editProjectManager"></select>

            <label for="editProjectExecutor">Исполнитель:</label>
            <select id="editProjectExecutor"></select>

            <label for="editProjectPriority">Приоритет</label>
            <select id="editProjectPriority">
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
            </select>
            <button id="confirmEditProjectBtn">Сохранить изменения</button>
        </div>
    </div>


    <!-- Модальное окно создания проекта -->
    <div id="createProjectModal" class="modal">
        <div class="modal-content">
            <span class="close" id="closeProjectModal">&times;</span>
            <h2>Создать проект</h2>

            <label for="projectName">Название проекта</label>
            <input type="text" id="projectName" placeholder="Название проекта" required>

            <label for="projectDescription">Описание проекта</label>
            <textarea id="projectDescription" placeholder="Описание проекта" rows="4"></textarea>

            <label for="startDate">Дата начала:</label>
            <input type="date" id="projectStartDate" required>

            <label for="endDate">Дата окончания:</label>
            <input type="date" id="projectEndDate" required>

            <label for="projectStatus">Статус</label>
            <select id="projectStatus" disabled>
                <option value="created">Создан</option>
                <option value="in_progress">В процессе</option>
                <option value="completed">Завершён</option>
            </select>

            <label for="projectManager">Руководители</label>
            <select id="projectManager"></select>

            <label for="projectExecutor">Исполнители</label>
            <select id="projectExecutor"></select>

            <label for="projectPriority">Приоритет</label>
            <select id="projectPriority">
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
            </select>
            <button id="confirmCreateProjectBtn">Создать</button>
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

            <label for="editTaskProject">Выберите проект:</label>
            <select id="editTaskProject" required></select>

            <button id="confirmEditTaskBtn">Сохранить изменения</button>
        </div>
    </div>
</body>

</html>