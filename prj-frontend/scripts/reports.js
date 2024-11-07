$(document).ready(function () {
    const projectsCache = {};
    const managersCache = {};
    const executorsCache = {};
    const tasksCache = {};
    let completedTasksCount = 0;
    let incompleteTasksCount = 0;

    function loadIntoCache(url, cache) {
        return $.ajax({
            url: url,
            method: 'GET',
            success: function (data) {
                data.forEach(item => {
                    cache[item.id] = item.name || item.title;
                });
                console.log(`Данные из ${url} успешно загружены:`, cache);
            },
            error: function () {
                console.error(`Ошибка при загрузке из ${url}`);
            }
        });
    }

    function loadTasksIntoCache() {
        return $.ajax({
            url: 'http://prj-backend/tasks',
            method: 'GET',
            success: function (data) {
                completedTasksCount = 0;
                incompleteTasksCount = 0;
                data.forEach(task => {
                    if (task.id) { // Проверка на существование id_tasks
                        tasksCache[task.id] = task;

                        if (task.project_id) {
                            if (!projectsCache[task.project_id]) {
                                projectsCache[task.project_id] = { title: 'Неизвестный проект', taskCount: 0 };
                            }
                            projectsCache[task.project_id].taskCount++;
                        }

                        if (task.status === 'Завершена') {
                            completedTasksCount++;
                        } else {
                            incompleteTasksCount++;
                        }
                    }
                });
                console.log('Задачи успешно загружены:', tasksCache);
                console.log(`Завершенные задачи: ${completedTasksCount}, Незавершенные задачи: ${incompleteTasksCount}`);
            },
            error: function () {
                console.error('Ошибка при загрузке задач');
            }
        });
    }

    function loadReports(searchTerm = '', statusFilter = 'all') {
        $.ajax({
            url: 'http://prj-backend/reports',
            type: 'GET',
            data: { search: searchTerm, status: statusFilter },
            dataType: 'json',
            success: function (data) {
                renderReports(data, statusFilter);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Ошибка при загрузке отчетов:', textStatus, errorThrown);
                alert('Не удалось загрузить отчеты. Попробуйте еще раз позже.');
            }
        });
    }

    function renderReports(reports, statusFilter) {
        const reportsContainer = $('.reports__cards');
        reportsContainer.empty();

        if (reports.length === 0) {
            reportsContainer.append('<div class="no-reports">Нет доступных отчетов.</div>');
            return;
        }

        reports.forEach(report => {
            const taskId = report.id;
            const task = taskId && tasksCache[taskId];
            const projectTitle = report.title || 'Проект не указан';
            const managerName = managersCache[report.maintainer_id] || 'Не указано';
            const executorName = executorsCache[report.executor_id] || 'Не указано';
            const remainingDays = report.remaining_days || 'Не указано';
            const status = report.status || 'Не указан';

            if (statusFilter !== 'all' && task && task.status !== statusFilter) {
                return;
            }

            const reportCard = `
                <div class="reports__card">
                    <div class="projects__card-title">Отчёт № ${report.id}</div>
                    <hr>
                    <div class="projects__card-manager">Проект: ${projectTitle} (Задач: ${report.task_counts.total})</div>
                    <hr>
                    <div class="projects__card-task">Новые задачи: ${report.task_counts.created}</div>
                    <hr>
                    <div class="projects__card-task">Завершенные задачи: ${report.task_counts.in_progress}</div>
                    <hr>
                    <div class="projects__card-task">Незавершенные задачи: ${report.task_counts.completed}</div>
                    <hr>
                    <div class="projects__card-managers">Руководитель: ${managerName}</div>
                    <hr>
                    <div class="projects__card-executor">Исполнитель: ${executorName}</div>
                    <hr>
                    <div class="projects__card-time">Осталось: <span class="tasks__card-time-value">${remainingDays}</span> д</div>
                    <hr>
                    <div class="projects__card-status">Статус: ${status}</div>
                </div>
            `;
            reportsContainer.append(reportCard);
        });

        // Вывод статистики задач
        $('.tasks__count').text(`Всего задач: ${Object.keys(tasksCache).length}`);
        $('.tasks__completed-count').text(`Завершено: ${completedTasksCount}`);
        $('.tasks__incomplete-count').text(`Не завершено: ${incompleteTasksCount}`);
    }

    Promise.all([
        loadIntoCache('http://prj-backend/getprojects', projectsCache),
        loadIntoCache('http://prj-backend/managers', managersCache),
        loadIntoCache('http://prj-backend/executors', executorsCache),
        loadTasksIntoCache()
    ]).then(() => {
        console.log('Все данные загружены:');
        console.log('Проекты:', projectsCache);
        console.log('Менеджеры:', managersCache);
        console.log('Исполнители:', executorsCache);
        loadReports();
    });

    $('.filter__search').on('submit', function (e) {
        e.preventDefault();
        const searchTerm = $(this).find('input[name="search"]').val();
        const statusFilter = $('.filter__status').val();
        loadReports(searchTerm, statusFilter);
    });

    $('.filter__status').on('change', function () {
        const statusFilter = $(this).val();
        const searchTerm = $('.filter__search-input').val();
        loadReports(searchTerm, statusFilter);
    });

    $('.filter__reset').on('click', function () {
        $('.filter__search-input').val('');
        $('.filter__status').val('all');
        loadReports();
    });
});
