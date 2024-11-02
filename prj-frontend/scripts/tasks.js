$(document).ready(function () {
    // Загрузка проектов в выпадающий список
    function loadProjectsIntoSelect() {
        $.ajax({
            url: 'http://prj-backend/getprojects',
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                $('#projectSelect').empty(); // Очистка выпадающего списка
                data.forEach(function (project) {
                    $('#projectSelect').append(`<option value="${project.id}">${project.title}</option>`); // Заполнение выпадающего списка
                });
            },
            error: function (xhr, status, error) {
                console.log('Ошибка при загрузке проектов:', error);
            }
        });
    }

    let projectsCache = {};

    function loadProjectsIntoCache() {
        $.ajax({
            url: 'http://prj-backend/getprojects',
            method: 'GET',
            success: function (data) {
                data.forEach(project => {
                    projectsCache[project.id] = project.title; // Кэшируем проекты в объект
                });
            },
            error: function () {
                console.error('Ошибка при загрузке проектов');
            }
        });
    }

    function getProjectNameById(projectId) {
        return projectsCache[projectId];
    }


    function loadTasks() {
        $.ajax({
            url: 'http://prj-backend/tasks',
            method: 'GET',
            success: function (data) {
                displayTasks(data); // Отображение задач
            },
            error: function (xhr, status, error) {
                console.error('Ошибка при загрузке задач:', error);
            }
        });
    }

    function displayTasks(tasks) {
        const tasksContainer = $('.tasks__list');
        tasksContainer.empty(); // Очищаем контейнер

        tasks.forEach(function (task) {
            // Создаем HTML для каждой задачи
            const taskCard = `
                <div class="task-card">
                    <h3>${task.title}</h3>
                    <p>${task.description}</p>
                    <p>Приоритет: ${task.priority}</p>
                    <p>Статус: ${task.status}</p>
                    <p>Дней осталось: ${task.days_left}</p>
                    <p>Период: ${task.start_date} - ${task.end_date}</p>
                    <p>Проект: ${task.project_title}</p>
                    <p>Исполнитель: ${task.executor_name}</p>
                    <button class="edit-task" data-id="${task.id}">Редактировать</button>
                    <button class="delete-task" data-id="${task.id}">Удалить</button>
                </div>
            `;
            tasksContainer.append(taskCard); // Добавляем задачу в контейнер
        });
    }

    function loadProjectsForEdit() {
        $.ajax({
            url: 'http://prj-backend/projects',
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                $('#editTaskProject').empty(); // Очистка предыдущих значений
                data.forEach(function (project) {
                    $('#editTaskProject').append(`<option value="${project.id}">${project.title}</option>`); // Добавление новых значений
                });
            },
            error: function (xhr, status, error) {
                console.log('Ошибка при загрузке проектов:', error);
            }
        });
    }

    function openEditTaskModal(taskId) {
        $.ajax({
            url: `http://prj-backend/tasks/${taskId}`,
            method: 'GET',
            dataType: 'json',
            success: function (task) {
                $('#editTaskName').val(task.title);
                $('#editTaskDescription').val(task.description);
                $('#editTaskStartDate').val(task.start_date.split('T')[0]); // Форматирование даты
                $('#editTaskEndDate').val(task.end_date.split('T')[0]);
                $('#editTaskProject').val(task.project_id); // Установка ID проекта

                loadProjectsForEdit();

                $('#editTaskModal').data('id', taskId).show(); // Сохранение ID задачи
            },
            error: function (xhr, status, error) {
                console.error('Ошибка при загрузке задачи:', error);
            }
        });
    }

    // Привязка событий к кнопкам задач
    function attachTaskActions() {
        $(document).on('click', '.edit-task', function () {
            const taskId = $(this).data('id');
            openEditTaskModal(taskId);
        });

        $(document).on('click', '.delete-task', function () {
            const taskId = $(this).data('id');
            deleteTask(taskId);
        });
    }

    // Открытие модального окна для создания задачи
    $('#createTaskBtn').click(function () {
        $('#createTaskModal').show();
        $('#taskName').val('');
        loadProjectsIntoSelect(); // Загрузка проектов перед открытием модального окна
    });

    // Подтверждение редактирования задачи
    $('#confirmEditTaskBtn').click(function () {
        const taskId = $('#editTaskModal').data('id'); // Получение ID задачи
        const taskName = $('#editTaskName').val().trim();
        const taskDescription = $('#editTaskDescription').val().trim();
        const startDate = $('#editTaskStartDate').val();
        const endDate = $('#editTaskEndDate').val();
        const projectID = $('#editTaskProject').val(); // Получение ID проекта

        if (taskName === '' || taskDescription === '' || !startDate || !endDate) {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        $.ajax({
            url: `http://prj-backend/tasks/${taskId}`, // URL для обновления задачи
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                title: taskName,
                description: taskDescription,
                start_date: startDate,
                end_date: endDate,
                project_id: projectID
            }),
            success: function () {
                $('#editTaskModal').hide();
                loadTasks(); // Обновить список задач
            },
            error: function (xhr, status, error) {
                console.log('Ошибка при редактировании задачи:', error);
            }
        });
    });


    // Функция для удаления задачи
    function deleteTask(taskId) {
        if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
            $.ajax({
                url: `http://prj-backend/tasks/${taskId}`, // Здесь должен быть правильный URL для удаления задачи
                method: 'DELETE',
                success: function () {
                    loadTasks(); // Обновляем список задач после удаления
                },
                error: function (xhr, status, error) {
                    console.log('Ошибка при удалении задачи:', error);
                }
            });
        }
    }

    // Закрытие модальных окон для создания и редактирования задачи
    $('#closeTaskModal, #closeEditTaskModal').click(function () {
        $('#createTaskModal, #editTaskModal').hide();
    });

    // Инициализация данных при загрузке страницы
    loadTasks();
    loadProjectsIntoSelect();
    attachTaskActions();


});