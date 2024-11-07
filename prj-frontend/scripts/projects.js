$(document).ready(function () {
    // Загрузка проектов
    function loadProjects(filters = {}) {
        $.ajax({
            url: 'http://prj-backend/projects',
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                $('.tasks__cards').empty();

                let filteredData = data

                if (filters.priority) {
                    filteredData = filteredData.filter(project => project.priority === filters.priority)
                }

                if (filters.endDate === 'near') {
                    const today = new Date();
                    filteredData = filteredData.filter(project => {
                        const endDate = new Date(project.end_date);
                        const diffInDays = (endDate - today) / (1000 * 60 * 60 * 24);
                        return diffInDays >= 0 && diffInDays <= 5;
                    })
                    console.log(filteredData);
                }

                filteredData.forEach(function (project) {
                    const startDate = new Date(project.start_date).toLocaleDateString();
                    const endDate = new Date(project.end_date).toLocaleDateString();

                    $('.tasks__cards').append(`
                        <div class="tasks__card ${project.priority}">
                            <div class="tasks__card-title">Название: ${project.title}</div>
                            <div class="tasks__card-description">Описание: ${project.description}</div>
                            <div class="tasks__card-start">Дата начала: ${startDate}</div>
                            <div class="tasks__card-end">Дата окончания: ${endDate}</div>
                <div class="tasks__card-manager">Руководитель: ${project.maintainer ? project.maintainer.name : 'Не назначен'}</div>
                <div class="tasks__card-executor">Исполнитель: ${project.executor ? project.executor.name : 'Не назначен'}</div>
                            <div class="tasks__card-priority">Приоритет: ${project.priority}</div>
                            <div class="tasks__card-status">Статус: ${project.status}</div>
                            <div class="tasks__card-remaining_days">Осталось дней: ${project.remaining_days}</div>
                            <div id='btns'>
                                <button class="btn btn-dark edit-project" data-id="${project.id}">Редактировать</button>
                                <button class="btn btn-danger delete-project" data-id="${project.id}">Удалить</button>
                            </div>
                        </div>
                    `);
                });
                attachProjectActions();
            },
            error: function (xhr, status, error) {
                console.log('Ошибка при загрузке проектов:', error);
            }
        });
    }

    loadProjects();

    $('.filter-btn').on('click', function () {
        const priority = $(this).data('priority');
        const endDate = $(this).data('end_date');

        const filters = {
            priority: priority || null,
            endDate: endDate || null,
        };

        loadProjects(filters);
    });

    // Установка минимальной даты окончания на сегодняшнюю дату
    function setMinDate() {
        const today = new Date().toISOString().split('T')[0];
        $('#projectEndDate').attr('min', today);
    }

    // Добавление действий для редактирования и удаления проекта
    function attachProjectActions() {
        $(document).on('click', '.edit-project', function () {
            const projectId = $(this).data('id');
            openEditProjectModal(projectId);
        });

        $(document).on('click', '.delete-project', function () {
            const projectId = $(this).data('id');
            deleteProject(projectId);
        });
    }

    // Открытие модального окна для создания проекта
    $('#createProjectBtn').click(function () {
        loadManagers(); // Загрузка списка менеджеров при создании
        loadExecutors(); // Загрузка списка исполнителей при создании
        setMinDate(); // Установка минимальной даты окончания
        $('#createProjectModal').show();
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

        for (const key in projectData) {
            if (!projectData[key]) {
                alert(`Поле ${key} обязательно для заполнения!`);
                return;
            }
        }

        $.ajax({
            url: 'http://prj-backend/projects',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(projectData),
            success: function () {
                loadProjects();
                $('#createProjectModal').hide();
            },
            error: function (xhr, status, error) {
                console.log('Ошибка при создании проекта:', error);
            }
        });
    });

    // Открытие модального окна для редактирования проекта
    function openEditProjectModal(projectId) {
        loadManagers();
        loadExecutors();  // Загрузка списка исполнителей
        $.ajax({
            url: `http://prj-backend/projects/${projectId}`,
            method: 'GET',
            dataType: 'json',
            success: function (project) {
                $('#editProjectName').val(project.title);
                $('#editProjectDescription').val(project.description);
                $('#editProjectStartDate').val(project.start_date.split('T')[0]);
                $('#editProjectEndDate').val(project.end_date.split('T')[0]);
                $('#editProjectStatus').val(project.status);
                $('#editProjectPriority').val(project.priority);
                $('#editProjectManager').val(project.maintainer_id);
                $('#editProjectExecutor').val(project.executor_id);

                // Устанавливаем минимальную дату окончания как дату начала проекта
                const startDate = project.start_date.split('T')[0];
                $('#editProjectEndDate').attr('min', startDate);

                $('#editProjectModal').show();
                $('#editProjectModal').data('id', projectId);
            },
            error: function (xhr, status, error) {
                console.log('Ошибка при загрузке проекта:', error);
            }
        });
    }

    // Удаление проекта
    function deleteProject(projectId) {
        if (confirm('Вы уверены, что хотите удалить этот проект?')) {
            $.ajax({
                url: `http://prj-backend/projects/${projectId}`,
                method: 'DELETE',
                success: function () {
                    loadProjects();
                },
                error: function (xhr, status, error) {
                    console.log('Ошибка при удалении проекта:', error);
                }
            });
        }
    }

    // Закрытие модальных окон
    $('#closeProjectModal, #closeEditProjectModal').click(function () {
        $('#createProjectModal, #editProjectModal').hide();
    });

    // Подтверждение редактирования проекта
    $('#confirmEditProjectBtn').on('click', function () {
        const projectId = $('#editProjectModal').data('id');
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
            success: function () {
                loadProjects();
                $('#editProjectModal').hide();
            },
            error: function (xhr, status, error) {
                console.log('Ошибка при редактировании проекта:', error);
            }
        });
    });

    // Функции для загрузки менеджеров и исполнителей
    function loadManagers() {
        $.ajax({
            url: 'http://prj-backend/managers',
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                $('#projectManager, #editProjectManager').empty();
                data.forEach(function (manager) {
                    $('#projectManager, #editProjectManager').append(
                        `<option value="${manager.id}">${manager.name}</option>`
                    );
                });
            },
            error: function (xhr, status, error) {
                console.log('Ошибка при загрузке руководителей:', error);
            }
        });
    }

    function loadExecutors() {
        $.ajax({
            url: 'http://prj-backend/executors',
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                $('#projectExecutor, #editProjectExecutor').empty();
                data.forEach(function (executor) {
                    $('#projectExecutor, #editProjectExecutor').append(
                        `<option value="${executor.id}">${executor.name}</option>`
                    );
                });
            },
            error: function (xhr, status, error) {
                console.log('Ошибка при загрузке исполнителей:', error);
            }
        });
    }

    // Инициализация данных при загрузке страницы
    loadProjects();
});
