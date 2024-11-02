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

    function loadTasks() {
        $.ajax({
            url: 'http://prj-backend/tasks', // Убедитесь, что этот URL правильный
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
        tasksContainer.empty(); // Очищаем контейнер, чтобы избежать дубликатов

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
                </div>
            `;
            tasksContainer.append(taskCard); // Добавляем задачу в контейнер
        });
    }

    // Вызов функции загрузки задач при загрузке страницы
    $(document).ready(function () {
        loadTasks();
    });

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

    // Подтверждение создания задачи
    $('#confirmCreateTaskBtn').on('click', function () {
        const projectId = $('#taskProjectId').val();  // получаем ID проекта из формы

        $.ajax({
            url: `http://prj-backend/projects/${projectId}`,
            method: 'GET',
            dataType: 'json',
            success: function (project) {
                const taskData = {
                    executor_id: project.user_id,  // ID пользователя из проекта
                    title: $('#taskName').val(),
                    description: $('#taskDescription').val(),
                    start_date: $('#taskStartDate').val(),
                    end_date: $('#taskEndDate').val(),
                    status: $('#taskStatus').val(),
                    priority: $('#taskPriority').val(),
                    project_id: projectId
                };

                for (const key in taskData) {
                    if (!taskData[key]) {
                        alert(`Поле ${key} обязательно для заполнения!`);
                        return;
                    }
                }

                $.ajax({
                    url: 'http://prj-backend/tasks',
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(taskData),
                    success: function () {
                        loadTasks();
                        $('#createTaskModal').hide();
                    },
                    error: function (xhr, status, error) {
                        console.log('Ошибка при создании задачи:', error);
                    }
                });
            },
            error: function (xhr, status, error) {
                console.log('Ошибка при получении данных проекта:', error);
            }
        });
    });

    // Закрытие модальных окон для создания и редактирования задачи
    $('#closeTaskModal, #closeEditTaskModal').click(function () {
        $('#createTaskModal, #editTaskModal').hide();
    });

    // Инициализация данных при загрузке страницы
    loadTasks();
    loadProjectsIntoSelect();
    attachTaskActions();
});
