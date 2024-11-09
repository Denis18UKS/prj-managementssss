$(document).ready(function () {
    loadProjectsIntoCache();
    loadTasks();

    let projectsCache = {};
    let filters = { priority: '', status: '' }; // Объявляем и инициализируем filters

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
                alert('Ошибка при загрузке проектов');
            }
        });
    }

    function getProjectNameById(projectId) {
        return projectsCache[projectId];
    }

    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }

    function loadTasks() {
        const userId = localStorage.getItem('userId');

        if (!userId) {
            alert('Ошибка: пользователь не авторизован');
            return;
        }

        $.ajax({
            url: 'http://prj-backend/tasks',
            method: 'GET',
            success: function (data) {
                const taskList = $('#taskList');
                taskList.empty();

                const filteredData = data.filter(task => {
                    const priorityMatch = filters.priority ? task.priority === filters.priority : true;
                    const statusMatch = filters.status ? task.status === filters.status : true;
                    return priorityMatch && statusMatch;
                });

                filteredData.forEach(task => {
                    const daysLeft = task.days_left === 0 ? 'Задача завершена' : task.days_left;
                    const projectName = getProjectNameById(task.project_id);

                    // Определяем, какие кнопки показывать в зависимости от статуса задачи
                    let taskActions = '';
                    if (task.status === 'Выполняется') {
                        taskActions = `
                            <div class="task-actions">
                                <button class="btn btn-danger finish-task" data-id="${task.id}">Завершить</button>
                            </div>
                        `;
                    } else if (task.status !== 'Завершена') {
                        taskActions = `
                            <div class="task-actions">
                                <button class="btn btn-warning start-task" data-id="${task.id}">Начать выполнение</button>
                            </div>
                        `;
                    }

                    // Проверка на истечение срока
                    let overdueMessage = '';
                    if (task.days_left < 0 && task.status !== 'Завершена') {
                        overdueMessage = '<div class="overdue-message">Срок истёк!</div>';
                    }

                    // Загрузка комментариев для задачи
                    loadComments(task.id).then(commentsSection => {
                        const taskCard = `
                            <div class="task-card" data-id="${task.id}">
                                <div class="task-title">Название: ${task.title}</div>
                                <div class="task-description">Описание: ${task.description}</div>
                                <hr>
                                <div class="task-project"><h6 class ='h6'>Проект: ${projectName || 'Неизвестный проект'}</h6></div>
                                <hr>
                                <div class="task-status"><strong>Статус:</strong> ${task.status}</div>
                                <hr>
                                <div class="task-dates">
                                    <div class="tasks__card-start">Дата начала: ${formatDate(task.start_date)}</div>
                                    <div class="tasks__card-end">Дата окончания: ${formatDate(task.end_date)}</div>
                                    Осталось дней: ${daysLeft}
                                </div>
                                <hr>
                                ${taskActions}
                                <div class="comments">
                                    <textarea id="comment-input-${task.id}" placeholder="Введите комментарий"></textarea>
                                    <button class="btn btn-primary add-comment" data-task-id="${task.id}">Добавить комментарий</button>
                                    <div class="comments-list" id="comments-${task.id}">
                                    <h6><b><center>Комментарии</center></b></h6>
                                    <hr>
                                    ${commentsSection}</div>
                                </div>
                            </div>
                        `;
                        taskList.append(taskCard);
                    });
                });
            },
            error: function (xhr, status, error) {
                alert('Ошибка при загрузке задач: ' + error);
            }
        });
    }

    function loadComments(taskId) {
        return $.ajax({
            url: `http://prj-backend/tasks/${taskId}/comments`,
            method: 'GET',
        }).then(comments => {
            return comments.map(comment => `
                <div class="comment">
                    <div class="comment-text">${comment.comment}</div>
                    <div style='color:black' class="comment-date">Дата создания: ${formatDate(comment.created_at)}</div>
                    <hr style='background:black'>
                </div>
            `).join('');
        }).catch(xhr => {
            console.error('Ошибка при загрузке комментариев:', xhr);
            return '';
        });
    }



    function addComment(taskId, comment) {
        if (!comment) {
            alert('Введите комментарий.');
            return;
        }

        $.ajax({
            url: `http://prj-backend/tasks/${taskId}/comments`,
            method: 'POST',
            data: { comment: comment },
            success: function (response) {
                alert(response.message);
                loadCommentsForTask(taskId); // Обновляем комментарии только для текущей задачи
                $(`#comment-input-${taskId}`).val(''); // Очищаем поле ввода комментария
            },
            error: function (xhr, status, error) {
                alert('Ошибка при добавлении комментария: ' + error);
            }
        });
    }


    function loadCommentsForTask(taskId) {
        loadComments(taskId).then(commentsSection => {
            $(`#comments-${taskId}`).html(commentsSection);
        });
    }


    function updateTaskStatus(taskId, newStatus) {
        $.ajax({
            url: `http://prj-backend/tasks/${taskId}/status`,
            method: 'PATCH',
            data: { status: newStatus },
            success: function (response) {
                alert(response.message);
                loadTasks(); // Перезагружаем задачи, чтобы отобразить обновленные данные
            },
            error: function (xhr, status, error) {
                alert('Ошибка при обновлении статуса задачи: ' + error);
            }
        });
    }

    // Обработчики событий для фильтров
    $('.filter-btn').click(function () {
        const selectedPriority = $(this).data('priority');
        const selectedStatus = $('.status-filter-btn.active').data('status') || '';
        filters.priority = selectedPriority; // Обновляем фильтр при нажатии
        filters.status = selectedStatus; // Обновляем фильтр при нажатии
        loadTasks(); // Вызываем загрузку задач с новыми фильтрами
    });

    $('.status-filter-btn').click(function () {
        const selectedStatus = $(this).data('status');
        const selectedPriority = $('.filter-btn.active').data('priority') || '';
        filters.status = selectedStatus; // Обновляем фильтр
        filters.priority = selectedPriority; // Обновляем фильтр
        loadTasks(); // Вызываем загрузку задач с новыми фильтрами
    });

    // Привязываем действия к кнопкам в делегировании событий
    $('#taskList').on('click', '.start-task', function () {
        updateTaskStatus($(this).data('id'), 'Выполняется');
    });

    $('#taskList').on('click', '.finish-task', function () {
        updateTaskStatus($(this).data('id'), 'Завершена');
    });

    $('#taskList').on('click', '.add-comment', function () {
        const taskId = $(this).data('task-id');
        const comment = $(`#comment-input-${taskId}`).val();
        addComment(taskId, comment);
    });
});