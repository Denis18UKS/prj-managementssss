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
