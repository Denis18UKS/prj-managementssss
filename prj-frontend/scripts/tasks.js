$(document).ready(function () {
    // Загрузка задач
    function loadTasks() {
        $.ajax({
            url: 'http://prj-backend/tasks',
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                $('.tasks__cards').empty();
                data.forEach(function (task) {
                    const startDate = new Date(task.start_date).toLocaleDateString();
                    const endDate = new Date(task.end_date).toLocaleDateString();

                    $('.tasks__cards').append(`
                        <div class="tasks__card ${task.priority}">
                            <div class="tasks__card-title">${task.title}</div>
                            <div class="tasks__card-description">${task.description}</div>
                            <div class="tasks__card-start">Дата начала: ${startDate}</div>
                            <div class="tasks__card-end">Дата окончания: ${endDate}</div>
                            <div class="tasks__card-executor">Исполнитель: ${task.executor.name}</div>
                            <div class="tasks__card-priority">Приоритет: ${task.priority}</div>
                            <div class="tasks__card-status">Статус: ${task.status}</div>
                            <div class="tasks__card-remaining_days">Осталось дней: ${task.remaining_days}</div>
                            <div id='btns'>
                                <button class="btn btn-dark edit-task" data-id="${task.id}">Редактировать</button>
                                <button class="btn btn-danger delete-task" data-id="${task.id}">Удалить</button>
                            </div>
                        </div>
                    `);
                });
                attachTaskActions();
            },
            error: function (xhr, status, error) {
                console.log('Ошибка при загрузке задач:', error);
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

    // Открытие модального окна для редактирования задачи
    function openEditTaskModal(taskId) {
        loadExecutors();
        $.ajax({
            url: `http://prj-backend/tasks/${taskId}`,
            method: 'GET',
            dataType: 'json',
            success: function (task) {
                $('#editTaskName').val(task.title);
                $('#editTaskDescription').val(task.description);
                $('#editTaskStartDate').val(task.start_date.split('T')[0]);
                $('#editTaskEndDate').val(task.end_date.split('T')[0]);
                $('#editTaskStatus').val(task.status);
                $('#editTaskPriority').val(task.priority);
                $('#editTaskExecutor').val(task.executor_id);

                $('#editTaskModal').show();
                $('#editTaskModal').data('id', taskId);
            },
            error: function (xhr, status, error) {
                console.log('Ошибка при загрузке задачи:', error);
            }
        });
    }

    // Удаление задачи
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

    // Открытие модального окна для создания задачи
    $('#createTaskBtn').click(function () {
        $('#createTaskModal').show();
        $('#taskName').val('');
    });

    // Подтверждение создания задачи
    $('#confirmCreateTaskBtn').on('click', function () {
        const taskData = {
            executor_id: $('#taskExecutor').val(),
            title: $('#taskName').val(),
            description: $('#taskDescription').val(),
            start_date: $('#taskStartDate').val(),
            end_date: $('#taskEndDate').val(),
            status: $('#taskStatus').val(),
            priority: $('#taskPriority').val()
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
    });

    // Закрытие модальных окон для создания и редактирования задачи
    $('#closeTaskModal, #closeEditTaskModal').click(function () {
        $('#createTaskModal, #editTaskModal').hide();
    });

    // Подтверждение редактирования задачи
    $('#confirmEditTaskBtn').on('click', function () {
        const taskId = $('#editTaskModal').data('id');
        const taskData = {
            executor_id: $('#editTaskExecutor').val(),
            title: $('#editTaskName').val(),
            description: $('#editTaskDescription').val(),
            start_date: $('#editTaskStartDate').val(),
            end_date: $('#editTaskEndDate').val(),
            status: $('#editTaskStatus').val(),
            priority: $('#editTaskPriority').val()
        };

        $.ajax({
            url: `http://prj-backend/tasks/${taskId}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(taskData),
            success: function () {
                loadTasks();
                $('#editTaskModal').hide();
            },
            error: function (xhr, status, error) {
                console.log('Ошибка при редактировании задачи:', error);
            }
        });
    });

    // Функция загрузки исполнителей
    function loadExecutors() {
        $.ajax({
            url: 'http://prj-backend/executors',
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                $('#editTaskExecutor, #taskExecutor').empty();
                data.forEach(function (executor) {
                    $('#editTaskExecutor, #taskExecutor').append(
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
    loadTasks();
    attachTaskActions();
});
