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
    <script src="../scripts/projects_for_managers.js" defer></script>
    <script src="../scripts/tasks.js" defer></script>
</head>

<body>
    <?php include 'manager-sidebar.php'; ?> <!-- Включаем навигационную панель -->

    <div class="container">
        <div class="filter">
            <button class="btn btn-danger filter-btn" data-priority="high">Высокий приоритет</button>
            <button class="btn btn-warning filter-btn" data-priority="medium">Средний приоритет</button>
            <button class="btn btn-success filter-btn" data-priority="low">Низкий приоритет</button>

            <!-- Фильтры по статусу -->
            <button class="btn btn-info status-filter-btn" data-status="in_progress">В процессе</button>
            <button class="btn btn-success status-filter-btn" data-status="completed">Завершенные</button>
            <button class="btn btn-dark status-filter-btn" data-status="">Сбросить</button> <!-- Для сброса фильтра -->
        </div>


        <div class="projects">
            <div class="projects__header">
                <h2 class="projects__header-title">Проекты</h2>
                <button class="add_user_btn" id="createProjectBtn">Создать проект</button>
            </div>

            <div class="tasks__cards"></div>
        </div>
    </div>

    <!-- Модальное окно редактирования проекта -->
    <div id="editProjectModal" class="modal">
        <div class="modal-content">
            <span class="close" id="closeEditProjectModal">&times;</span>
            <h2>Редактировать проект</h2>

            <label for="editProjectName">Название проекта</label>
            <input disabled type="text" id="editProjectName" placeholder="Название проекта" required>

            <label for="editProjectDescription">Описание проекта</label>
            <textarea disabled id="editProjectDescription" placeholder="Описание проекта" rows="4"></textarea>

            <label for="editProjectStartDate">Дата начала:</label>
            <input disabled type="date" id="editProjectStartDate" required>

            <label for="editProjectEndDate">Дата окончания:</label>
            <input disabled type="date" id="editProjectEndDate" required>

            <label for="editProjectStatus">Статус проекта</label>
            <select id="editProjectStatus">
                <option value="created">Создан</option>
                <option value="in_progress">В процессе</option>
                <option value="completed">Завершён</option>
            </select>

            <label for="editProjectManager">Руководители</label>
            <select id="editProjectManager" disabled></select>

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


</body>

</html>