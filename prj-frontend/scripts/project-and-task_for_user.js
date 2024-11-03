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
                console.error('Ошибка при загрузке проектов');
            }
        });
    }

    function getProjectNameById(projectId) {
        return projectsCache[projectId];
    }

    function loadTasks() {
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
                    const commentsSection = loadComments(task.id);
                    
                    const taskCard = `
                        <div class="task-card" data-id="${task.id}">
                            <div class="task-title">Название: ${task.title}</div>
                            <div class="task-description">Описание: ${task.description}</div>
                            <div class="task-project"><h6>Проект: ${projectName || 'Неизвестный проект'}</h6></div>
                            <div class="task-status"><strong>Статус:</strong> ${task.status}</div>
                            <div class="task-dates">
                                Дата начала: ${task.start_date || 'N/A'}<br>
                                Дата окончания: ${task.end_date || 'N/A'}<br>
                                Осталось дней: ${daysLeft}
                            </div>
                            ${taskActions}
                            <div class="comments">
                                <h6>Комментарии:</h6>
                                <div class="comments-list" id="comments-${task.id}">${commentsSection}</div>
                                <textarea id="comment-input-${task.id}" placeholder="Введите комментарий"></textarea>
                                <button class="btn btn-primary add-comment" data-task-id="${task.id}">Добавить комментарий</button>
                            </div>
                        </div>
                    `;
                    taskList.append(taskCard);
                });
    
                // Привязываем действия к кнопкам
                $('.start-task').on('click', function () {
                    updateTaskStatus($(this).data('id'), 'Выполняется');
                });
    
                $('.finish-task').on('click', function () {
                    updateTaskStatus($(this).data('id'), 'Завершена');
                });

                // Привязываем действия к кнопкам добавления комментариев
                $('.add-comment').on('click', function () {
                    const taskId = $(this).data('task-id');
                    const comment = $(`#comment-input-${taskId}`).val();
                    addComment(taskId, comment);
                });
            },
            error: function (xhr, status, error) {
                console.error('Ошибка при загрузке задач:', error);
            }
        });
    }

    function loadComments(taskId) {
        let commentsHtml = '';
        $.ajax({
            url: `http://prj-backend/tasks/${taskId}/comments`,
            method: 'GET',
            async: false, // Установим в false, чтобы дождаться завершения перед загрузкой
            success: function (comments) {
                comments.forEach(comment => {
                    commentsHtml += `<div class="comment">${comment.comment}</div>`;
                });
            },
            error: function (xhr, status, error) {
                console.error('Ошибка при загрузке комментариев:', error);
            }
        });
        return commentsHtml;
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
                console.error('Ошибка при добавлении комментария:', error);
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
                console.error('Ошибка при обновлении статуса задачи:', error);
            }
        });
    }

});
