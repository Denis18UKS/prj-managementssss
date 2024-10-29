$(document).ready(function () {
    // Загрузка проектов и руководителей
    function loadProjects() {
        $.ajax({
            url: 'http://prj-backend/projects',
            method: 'GET',
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
            error: function () {
                console.log('Ошибка при загрузке проектов');
            }
        });
    }

    function loadManagerOptions() {
        // Здесь нужно запросить список пользователей (руководителей) 
        $.ajax({
            url: 'http://prj-backend/managers', // Или ваш URL для пользователей
            method: 'GET',
            success: function (data) {
                $('#projectManager').empty();
                data.forEach(function (user) {
                    $('#projectManager').append(`<option value="${user.id}">${user.name}</option>`);
                });
            },
            error: function () {
                console.log('Ошибка при загрузке руководителей');
            }
        });
    }

    function loadProjectSelect() {
        $.ajax({
            url: 'http://prj-backend/projects',
            method: 'GET',
            success: function (data) {
                $('#taskProjectId').empty();
                data.forEach(function (project) {
                    $('#taskProjectId').append(`<option value="${project.id}">${project.title}</option>`);
                });
            },
            error: function () {
                console.log('Ошибка при загрузке проектов для задач');
            }
        });
    }

    function loadAssigneeOptions() {
        $.ajax({
            url: 'http://prj-backend/users', // Или ваш URL для пользователей
            method: 'GET',
            success: function (data) {
                $('#taskAssigneeId').empty();
                data.forEach(function (user) {
                    $('#taskAssigneeId').append(`<option value="${user.id}">${user.name}</option>`);
                });
            },
            error: function () {
                console.log('Ошибка при загрузке исполнителей');
            }
        });
    }


    function loadTaskSelect() {
        $.ajax({
            url: 'http://prj-backend/tasks', // или ваш URL для задач
            method: 'GET',
            success: function (data) {
                $('#projectTaskId').empty();
                data.forEach(function (task) {
                    $('#projectTaskId').append(`<option value="${task.id}">${task.title}</option>`);
                });
            },
            error: function () {
                console.log('Ошибка при загрузке задач');
            }
        });
    }

    loadProjects();
    loadManagerOptions();
    loadProjectSelect();
    loadAssigneeOptions();
    loadTaskSelect();

    $('#createProjectBtn').click(function () {
        $('#createProjectModal').show();
        $('#projectName').val('');
    });

    $('#createTaskBtnModal').click(function () {
        $('#createTaskModal').show();
        $('#taskName').val('');
    });

    $('#closeProjectModal, #closeTaskModal').click(function () {
        $('#createProjectModal, #createTaskModal').hide();
    });

    $('#confirmCreateProjectBtn').click(function () {
        const projectName = $('#projectName').val();
        const projectManager = $('#projectManager').val();
        const projectPriority = $('#projectPriority').val();

        $.ajax({
            url: 'http://prj-backend/projects',
            method: 'POST',
            data: {
                title: projectName,
                maintainer_id: projectManager,
                project_priority: projectPriority
            },
            success: function () {
                loadProjects();
                $('#createProjectModal').hide();
            },
            error: function () {
                console.log('Ошибка при создании проекта');
            }
        });
    });

    $('#confirmCreateTaskBtn').click(function () {
        const taskName = $('#taskName').val();
        const taskDescription = $('#taskDescription').val();

        $.ajax({
            url: 'http://prj-backend/tasks',
            method: 'POST',
            data: {
                title: taskName,
                description: taskDescription,
            },
            success: function () {
                loadProjects();
                $('#createTaskModal').hide();
            },
            error: function () {
                console.log('Ошибка при создании задачи');
            }
        });
    });
});