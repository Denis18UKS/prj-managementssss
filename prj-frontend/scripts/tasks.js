$(document).ready(function () {
    const projectsCache = {};

    // Загрузка проектов в выпадающий список для создания задачи
    function loadProjectsIntoSelect() {
        $.ajax({
            url: 'http://prj-backend/getprojects',
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                $('#projectSelect').empty();
                data.forEach(function (project) {
                    $('#projectSelect').append(`<option value="${project.id}">${project.title}</option>`);
                });
            },
            error: function (xhr, status, error) {
                console.log('Ошибка при загрузке проектов:', error);
            }
        });
    }

    function loadProjectsIntoEditSelect() {
        $.ajax({
            url: 'http://prj-backend/getprojects',
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                $('#editTaskProject').empty();
                data.forEach(function (project) {
                    $('#editTaskProject').append(`<option value="${project.id}">${project.title}</option>`);
                });
            },
            error: function (xhr, status, error) {
                console.log('Ошибка при загрузке проектов:', error);
            }
        });
    }

    // Кэширование проектов для быстрого доступа
    function loadProjectsIntoCache() {
        $.ajax({
            url: 'http://prj-backend/getprojects',
            method: 'GET',
            success: function (data) {
                data.forEach(project => {
                    projectsCache[project.id] = project.title;
                });
            },
            error: function () {
                console.error('Ошибка при загрузке проектов');
            }
        });
    }

    // Функция отображения задач
    function displayTasks(tasks) {
        const tasksContainer = $('.tasks__list');
        tasksContainer.empty();

        tasks.forEach(function (task) {
            const taskCard = `
                <div class="task-card">
                    <h3>${task.title}</h3>
                    <p>${task.description}</p>
                    <p>Приоритет: ${task.priority}</p>
                    <p>Статус: ${task.status}</p>
                    <p>Дней осталось: ${task.days_left}</p>
                    <p>Период: ${task.start_date} - ${task.end_date}</p>
                    <p>Проект: ${projectsCache[task.project_id]}</p>
                    <button class="edit-task" data-id="${task.id}">Редактировать</button>
                    <button class="delete-task" data-id="${task.id}">Удалить</button>
                </div>
            `;
            tasksContainer.append(taskCard);
        });
    }

    // Загрузка задач с сервера
    function loadTasks() {
        $.ajax({
            url: 'http://prj-backend/tasks',
            method: 'GET',
            success: function (data) {
                displayTasks(data);
            },
            error: function (xhr, status, error) {
                console.error('Ошибка при загрузке задач:', error);
            }
        });
    }

    // Функция открытия модального окна редактирования задачи
    function openEditTaskModal(taskId) {
        $.ajax({
            url: `http://prj-backend/tasks/${taskId}`,
            method: 'GET',
            dataType: 'json',
            success: function (task) {
                $('#editTaskName').val(task.title);
                $('#editTaskDescription').val(task.description);
                $('#editTaskStartDate').val(task.start_date.split('T')[0]);
                $('#editTaskEndDate').val(task.end_date.split('T')[0]);
                $('#editTaskProject').val(task.project_id);

                loadProjectsIntoEditSelect();

                $('#editTaskModal').data('id', taskId).show();
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
        loadProjectsIntoSelect();
    });

    // Подтверждение создания задачи
    $('#confirmCreateTaskBtn').click(function () {
        const taskName = $('#taskName').val().trim();
        const taskDescription = $('#taskDescription').val().trim();
        const startDate = $('#startDate').val();
        const endDate = $('#endDate').val();
        const projectID = $('#projectSelect').val();

        if (!taskName || !startDate || !endDate || startDate > endDate) {
            alert('Пожалуйста, заполните все поля корректно');
            return;
        }

        $.ajax({
            url: 'http://prj-backend/tasks',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                title: taskName,
                description: taskDescription,
                start_date: startDate,
                end_date: endDate,
                project_id: projectID
            }),
            success: function () {
                $('#createTaskModal').hide();
                loadTasks();
            },
            error: function (xhr, status, error) {
                console.log('Ошибка при создании задачи:', error);
            }
        });
    });

    // Подтверждение редактирования задачи
    $('#confirmEditTaskBtn').click(function () {
        const taskId = $('#editTaskModal').data('id');
        const taskName = $('#editTaskName').val().trim();
        const taskDescription = $('#editTaskDescription').val().trim();
        const startDate = $('#editTaskStartDate').val();
        const endDate = $('#editTaskEndDate').val();
        const projectID = $('#editTaskProject').val();

        if (!taskName || !startDate || !endDate || startDate > endDate) {
            alert('Пожалуйста, заполните все поля корректно');
            return;
        }

        $.ajax({
            url: `http://prj-backend/tasks/${taskId}`,
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
                loadTasks();
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
                url: `http://prj-backend/tasks/${taskId}`,
                method: 'DELETE',
                success: function () {
                    loadTasks();
                },
                error: function (xhr, status, error) {
                    console.log('Ошибка при удалении задачи:', error);
                }
            });
        }
    }

    // Инициализация
    loadProjectsIntoCache();
    loadTasks();
    attachTaskActions();
    $('#closeTaskModal, #closeEditTaskModal').click(function () {
        $(this).closest('.modal').hide();
    });
});
