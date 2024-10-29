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
                    $('.tasks__cards').append(`
                        <div class="tasks__card ${project.priority}">
                            <div class="tasks__card-project">${project.title}</div>
                            <div class="tasks__card-manager">Руководитель: ${project.maintainer.name}</div>
                            <button class="add_user_btn edit-project" data-id="${project.id}">Редактировать</button>
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
    loadManagerOptions();
    loadTaskSelect();
    loadExecutorOptions();

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
    $('#confirmCreateProjectBtn').click(function () {
        const projectName = $('#projectName').val().trim();
        const projectDescription = $('#projectDescription').val().trim();
        const projectStartDate = $('#projectStartDate').val();
        const projectEndDate = $('#projectEndDate').val();
        const projectStatus = $('#projectStatus').val();
        const projectManager = $('#projectManager').val();
        const projectExecutor = $('#projectExecutor').val();
        const projectPriority = $('#projectPriority').val();

        if (projectName === '' || !projectStartDate || !projectEndDate) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }

        $.ajax({
            url: 'http://prj-backend/projects',
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                title: projectName,
                description: projectDescription,
                start_date: projectStartDate,
                end_date: projectEndDate,
                status: projectStatus,
                maintainer_id: projectManager,
                executor_id: projectExecutor,
                project_priority: projectPriority
            }),
            success: function () {
                loadProjects();
                $('#createProjectModal').hide();
            },
            error: function (xhr, status, error) {
                console.log('Ошибка при создании проекта:', error);
            }
        });
    });

    // Подтверждение создания задачи
    $('#confirmCreateTaskBtn').click(function () {
        const taskName = $('#taskName').val().trim();
        const taskDescription = $('#taskDescription').val().trim();
        const startDate = $('#startDate').val();
        const endDate = $('#endDate').val();

        if (taskName === '' || taskDescription === '' || !startDate || !endDate) {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        $.ajax({
            url: 'http://prj-backend/tasks',
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                title: taskName,
                description: taskDescription,
                start_date: startDate,
                end_date: endDate
            }),
            success: function () {
                loadProjects(); // Возможно, нужно обновить только задачи
                $('#createTaskModal').hide();
            },
            error: function (xhr, status, error) {
                console.log('Ошибка при создании задачи:', error);
            }
        });
    });
});
