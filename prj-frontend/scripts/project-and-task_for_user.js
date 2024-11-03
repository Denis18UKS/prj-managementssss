$(document).ready(function () {
    loadProjectsIntoCache();
    loadTasks();

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

                data.forEach(task => {
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

                    // Загрузка комментариев для задачи
                    loadComments(task.id).then(commentsSection => {
                        const taskCard = `
                            <div class="task-card" data-id="${task.id}">
                                <div class="task-title">Название: ${task.title}</div>
                                <div class="task-description">Описание: ${task.description}</div>
                                <div class="task-project"><h6>Проект: ${projectName || 'Неизвестный проект'}</h6></div>
                                <div class="task-status"><strong>Статус:</strong> ${task.status}</div>
                                <div class="task-dates">
                                    Дата начала: ${formatDate(task.start_date)}<br>
                                    Дата окончания: ${formatDate(task.end_date)}<br>
                                    Осталось дней: ${daysLeft}
                                </div>
                                ${taskActions}
                                <div class="comments">
                                    <textarea id="comment-input-${task.id}" placeholder="Введите комментарий"></textarea>
                                    <button class="btn btn-primary add-comment" data-task-id="${task.id}">Добавить комментарий</button>
                                </div>
                                <div class="comments">
                                    <h6><b>Комментарии:</b></h6>
                                    <div class="comments-list" id="comments-${task.id}">${commentsSection}</div>
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
            return comments.map(comment => `<div class="comment">${comment.comment}</div>`).join('');
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
                loadTasks(); // Перезагружаем задачи, чтобы отобразить обновленные комментарии
            },
            error: function (xhr, status, error) {
                alert('Ошибка при добавлении комментария: ' + error);
            }
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
