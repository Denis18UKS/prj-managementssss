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
            <form class="filter__search" action="" method="get">
                <input name="search" class="filter__search-input" type="text" value="" placeholder="Найти задачу">
                <button class="filter__search-button">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 1.75C9.35093 1.75 8.21312 1.97633 7.15152 2.41605C6.08992 2.85578 5.12533 3.5003 4.31282 4.31282C3.5003 5.12533 2.85578 6.08992 2.41605 7.15152C1.97633 8.21312 1.75 9.35093 1.75 10.5C1.75 11.6491 1.97633 12.7869 2.41605 13.8485C2.85578 14.9101 3.5003 15.8747 4.31282 16.6872C5.12533 17.4997 6.08992 18.1442 7.15152 18.5839C8.21312 19.0237 9.35093 19.25 10.5 19.25C12.8206 19.25 15.0462 18.3281 16.6872 16.6872C18.3281 15.0462 19.25 12.8206 19.25 10.5C19.25 8.17936 18.3281 5.95376 16.6872 4.31282C15.0462 2.67187 12.8206 1.75 10.5 1.75ZM0.25 10.5C0.25 4.84 4.84 0.25 10.5 0.25C16.16 0.25 20.75 4.84 20.75 10.5C20.75 13.06 19.811 15.402 18.259 17.198L21.53 20.47C21.6037 20.5387 21.6628 20.6218 21.7038 20.7153C21.7448 20.8088 21.7666 20.9118 21.7675 21.0153C21.7685 21.1187 21.7487 21.2211 21.7092 21.3141C21.6696 21.4071 21.6101 21.4903 21.535 21.5587C21.4598 21.6271 21.3709 21.6781 21.2725 21.7075C21.1741 21.7369 21.0691 21.7435 20.9718 21.7273C20.8745 21.7112 20.7876 21.6723 20.7199 21.6154C20.6523 21.5585 20.6063 21.4865 20.5883 21.4049L17.0801 17.8966C15.9189 18.8709 14.4698 19.5 12.75 19.5C10.0588 19.5 7.83982 18.5154 6.43733 16.7713C5.03483 15.0273 4.25 12.85 4.25 10.5H0.25Z" fill="white" />
                    </svg>
                </button>
            </form>
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