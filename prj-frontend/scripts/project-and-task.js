$(document).ready(function () {
    // Загрузка проектов
    function loadProjects() {
        $.ajax({
            url: 'http://prj-backend/projects',
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                $('.tasks__cards').empty();
                data.forEach(function (project) {
                    const startDate = new Date(project.start_date).toLocaleDateString(); // Приведение даты начала к привычному формату
                    const endDate = new Date(project.end_date).toLocaleDateString(); // Приведение даты окончания к привычному формату

                    $('.tasks__cards').append(`
                        <div class="tasks__card ${project.priority}">
                            <div class="tasks__card-title">${project.title}</div>
                            <hr>
                            <div class="tasks__card-description">${project.description}</div>
                            <hr>
                            <div class="tasks__card-start">Дата начала: ${startDate}</div>
                            <hr>
                            <div class="tasks__card-end">Дата окончания: ${endDate}</div>
                            <hr>
                            <div class="tasks__card-manager">Руководитель: ${project.maintainer.name}</div>
                            <hr>
                            <div class="tasks__card-executor">Исполнитель: ${project.executor.name}</div>
                            <hr>
                            <div class="tasks__card-priority">Приоритет: ${project.priority}</div>
                            <hr>
                            <div class="tasks__card-status">Статус: ${project.status}</div>
                            <hr>
                            <div class="tasks__card-remaining_days">Осталось дней: ${project.remaining_days}</div>
                            <hr>
                            <div id='btns'>
                                <button class="btn btn-dark edit-project" data-id="${project.id}">Редактировать</button>
                                <button class="btn btn-danger delete-project" data-id="${project.id}">Удалить</button>
                            </div>
                        </div>
                    `);
                });
            },
            error: function (xhr, status, error) {
                console.log('Ошибка при загрузке проектов:', error);
            }
        });
    }

    function loadManagerOptions() {
        $.ajax({
            url: 'http://prj-backend/managers',
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                $('#projectManager').empty();
                data.forEach(function (user) {
                    $('#projectManager').append(`<option value="${user.id}">${user.name}</option>`);
                });
            },
            error: function (xhr, status, error) {
                console.log('Ошибка при загрузке руководителей:', error);
            }
        });
    }

    function loadExecutorOptions() {
        $.ajax({
            url: 'http://prj-backend/executors',
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                $('#projectExecutor').empty();
                data.forEach(function (user) {
                    $('#projectExecutor').append(`<option value="${user.id}">${user.name}</option>`);
                });
            },
            error: function (xhr, status, error) {
                console.log('Ошибка при загрузке исполнителей:', error);
            }
        });
    }

    function loadTaskSelect() {
        $.ajax({
            url: 'http://prj-backend/tasks',
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                $('#projectTaskId').empty();
                data.forEach(function (task) {
                    $('#projectTaskId').append(`<option value="${task.id}">${task.title}</option>`);
                });
            },
            error: function (xhr, status, error) {
                console.log('Ошибка при загрузке задач:', error);
            }
        });
    }

    // Инициализация данных при загрузке страницы
    loadProjects();
    loadProjectsIntoCache();
    loadManagerOptions();
    loadExecutorOptions();
    loadTaskSelect();
    loadProjectsIntoSelect();
    loadTasksDisplay();
    loadTasks();

    // Открытие модального окна для создания проекта
    $('#createProjectBtn').click(function () {
        $('#createProjectModal').show();
        $('#projectName').val('');
    });

    // Открытие модального окна для создания задачи
    $('#createTaskBtnModal').click(function () {
        $('#createTaskModal').show();
        $('#taskName').val('');
    });

    // Закрытие модального окна для создания проекта
    $('#closeProjectModal').click(function () {
        $('#createProjectModal').hide();
    });

    // Закрытие модального окна для создания задачи
    $('#closeTaskModal').click(function () {
        $('#createTaskModal').hide();
    });

    // Подтверждение создания проекта
    $('#confirmCreateProjectBtn').on('click', function () {
        const projectData = {
            maintainer_id: $('#projectManager').val(),
            executor_id: $('#projectExecutor').val(),
            title: $('#projectName').val(),
            description: $('#projectDescription').val(),
            start_date: $('#projectStartDate').val(),
            end_date: $('#projectEndDate').val(),
            status: $('#projectStatus').val(),
            priority: $('#projectPriority').val()
        };

        $.ajax({
            url: 'http://prj-backend/projects',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(projectData),
            success: function (response) {
                // Действия при успешном создании проекта
                loadProjects();
                $('#createProjectModal').hide();
            },
            error: function (xhr, status, error) {
                console.log('Ошибка при создании проекта:', error);
            }
        });
    });

    function loadManagers() {
        $.ajax({
            url: 'http://prj-backend/managers',
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                $('#editProjectManager').empty();
                data.forEach(function (manager) {
                    $('#editProjectManager').append(
                        `<option value="${manager.id}">${manager.name}</option>`
                    );
                });
            },
            error: function (xhr, status, error) {
                console.log('Ошибка при загрузке руководителей:', error);
            }
        });
    }

    // Открытие модального окна для редактирования проекта
    $(document).on('click', '.edit-project', function () {
        const projectId = $(this).data('id');
        loadManagers();



        // Загрузка данных проекта
        $.ajax({
            url: `http://prj-backend/projects/${projectId}`,
            method: 'GET',
            dataType: 'json',
            success: function (project) {
                $('#editProjectName').val(project.title);
                $('#editProjectDescription').val(project.description);
                $('#editProjectStartDate').val(project.start_date.split('T')[0]); // Приведение к формату YYYY-MM-DD
                $('#editProjectEndDate').val(project.end_date.split('T')[0]);
                $('#editProjectStatus').val(project.status);
                $('#editProjectPriority').val(project.priority);
                $('#editProjectManager').val(project.maintainer_id);

                $('#editProjectModal').show();
                $('#editProjectModal').data('id', projectId); // Сохранение ID проекта для редактирования
            },
            error: function (xhr, status, error) {
                console.log('Ошибка при загрузке проекта:', error);
            }
        });
    });

    // Закрытие модального окна для редактирования проекта
    $('#closeEditProjectModal').click(function () {
        $('#editProjectModal').hide();
    });

    // Подтверждение редактирования проекта
    $('#confirmEditProjectBtn').on('click', function () {
        const projectId = $('#editProjectModal').data('id'); // Получение ID проекта
        const projectData = {
            maintainer_id: $('#editProjectManager').val(),
            executor_id: $('#editProjectExecutor').val(),
            title: $('#editProjectName').val(),
            description: $('#editProjectDescription').val(),
            start_date: $('#editProjectStartDate').val(),
            end_date: $('#editProjectEndDate').val(),
            status: $('#editProjectStatus').val(),
            priority: $('#editProjectPriority').val()
        };

        $.ajax({
            url: `http://prj-backend/projects/${projectId}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(projectData),
            success: function (response) {
                loadProjects(); // Перезагрузка списка проектов
                $('#editProjectModal').hide(); // Закрытие модального окна
            },
            error: function (xhr, status, error) {
                console.log('Ошибка при редактировании проекта:', error);
            }
        });
    });

    // Удаление проекта
    $(document).on('click', '.delete-project', function () {
        const projectId = $(this).data('id');
        if (confirm('Вы уверены, что хотите удалить этот проект?')) {
            $.ajax({
                url: `http://prj-backend/projects/${projectId}`,
                method: 'DELETE',
                success: function (response) {
                    loadProjects(); // Перезагрузка списка проектов
                },
                error: function (xhr, status, error) {
                    console.log('Ошибка при удалении проекта:', error);
                }
            });
        }
    });

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
    // Подтверждение создания задачи
    $('#confirmCreateTaskBtn').click(function () {
        const taskName = $('#taskName').val().trim();
        const taskDescription = $('#taskDescription').val().trim();
        const startDate = $('#startDate').val();
        const endDate = $('#endDate').val();
        const projectID = $('#projectSelect').val(); // Получение ID из выпадающего списка проектов

        if (taskName === '' || taskDescription === '' || !startDate || !endDate) {
            alert('Пожалуйста, заполните все поля');
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
                loadTasks(); // Обновить список задач
            },
            error: function (xhr, status, error) {
                console.log('Ошибка при создании задачи:', error);
            }
        });
    });

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

    function loadTasksDisplay() {
        $.ajax({
            url: 'http://prj-backend/tasks',
            method: 'GET',
            success: function (data) {
                const taskList = $('#taskList');
                taskList.empty(); // Очистить список перед добавлением новых задач
                data.forEach(task => {
                    const projectName = getProjectNameById(task.project_id); // Получение названия проекта
                    const taskCard = `
                        <div class="task-card" data-id="${task.id}">
                            <div class="task-title">${task.title}</div>
                            <div class="task-description">${task.description}</div>
                            <div class="task-project">Проект: ${projectName || 'Неизвестный проект'}</div>
                            <div class="task-actions">
                                <button class="edit-task">Редактировать</button>
                                <button class="delete-task" data-id="${task.id}">Удалить</button>
                            </div>
                        </div>
                    `;
                    taskList.append(taskCard);
                });
                bindTaskActions(); // Привязка действий к кнопкам задач
            },
            error: function () {
                console.error('Ошибка при загрузке задач');
                $('#taskList').html('<p>Не удалось загрузить задачи.</p>');
            }
        });
    }

    // Привязка действий к задачам (редактирование и удаление)
    function bindTaskActions() {
        // Удаление задачи
        $(document).on('click', '.delete-task', function () {
            const taskId = $(this).data('id');
            if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
                $.ajax({
                    url: `http://prj-backend/tasks/${taskId}`,
                    method: 'DELETE',
                    success: function () {
                        loadTasks(); // Обновление списка задач после удаления
                    },
                    error: function (xhr, status, error) {
                        console.log('Ошибка при удалении задачи:', error);
                    }
                });
            }
        });


    }

    function loadTasks() {
        $.ajax({
            url: 'http://prj-backend/tasks',
            method: 'GET',
            success: function (data) {
                const taskList = $('#taskList');
                taskList.empty(); // Очистка списка задач перед добавлением новых

                data.forEach(task => {
                    const projectName = getProjectNameById(task.project_id);
                    const taskCard = `
                        <div class="task-card" data-id="${task.id}">
                            <div class="task-title">
                                Назване:
                                ${task.title}
                            </div>
                            <div class="task-description">
                                Описание: <br>
                                ${task.description}
                            </div>
                            <div class="task-project"><h6>Проект: ${projectName || 'Неизвестный проект'}</h6></div>
                            <div class="task-actions">
                                <button class="edit-task btn btn-success" data-id="${task.id}">Редактировать</button>
                                <button class="delete-task btn btn-danger" data-id="${task.id}">Удалить</button>
                            </div>
                        </div>
                    `;
                    taskList.append(taskCard);
                });

                // Привязываем действия к кнопкам редактирования
                $('.edit-task').on('click', function () {
                    const taskId = $(this).data('id');
                    openEditTaskModal(taskId);
                });

                $('.delete-task').on('click', function () {
                    const taskId = $(this).data('id');
                    deleteTask(taskId);
                });
            },
            error: function (xhr, status, error) {
                console.error('Ошибка при загрузке задач:', error);
            }
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

    // Закрытие модального окна редактирования задачи
    $('#closeEditTaskModal').click(function () {
        $('#editTaskModal').hide();
    });

    // Подтверждение редактирования задачи
    $('#confirmEditTaskBtn').on('click', function () {
        const taskId = $('#editTaskModal').data('id'); // Получение ID задачи
        const taskData = {
            title: $('#editTaskName').val(),
            description: $('#editTaskDescription').val(),
            start_date: $('#editTaskStartDate').val(),
            end_date: $('#editTaskEndDate').val(),
            project_id: $('#editTaskProject').val()
        };

        $.ajax({
            url: `http://prj-backend/tasks/${taskId}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(taskData),
            success: function (response) {
                loadTasks(); // Обновить список задач
                $('#editTaskModal').hide(); // Закрытие модального окна
            },
            error: function (xhr, status, error) {
                console.log('Ошибка при редактировании задачи:', error);
            }
        });
    });

    // Удаление задачи
    $(document).on('click', '.delete-task', function () {
        const taskId = $(this).data('id');
        if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
            $.ajax({
                url: `http://prj-backend/tasks/${taskId}`,
                method: 'DELETE',
                success: function () {
                    loadTasks(); // Перезагрузка списка задач
                },
                error: function (xhr, status, error) {
                    console.log('Ошибка при удалении задачи:', error);
                }
            });
        }
    });
});
