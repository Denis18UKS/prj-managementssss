$(document).ready(function () {
    const projectsCache = {};
    const managersCache = {};
    const executorsCache = {};

    // Загрузка проектов в кэш
    function loadProjectsIntoCache() {
        return $.ajax({
            url: 'http://prj-backend/getprojects',
            method: 'GET',
            success: function (data) {
                data.forEach(project => {
                    projectsCache[project.id] = project.title;
                });
            },
            error: function () {
                console.error('Ошибка при загрузке проектов');
            }
        });
    }

    // Загрузка менеджеров в кэш
    function loadManagersIntoCache() {
        return $.ajax({
            url: 'http://prj-backend/managers',
            method: 'GET',
            success: function (data) {
                data.forEach(manager => {
                    managersCache[manager.id] = manager.name;
                });
            },
            error: function () {
                console.error('Ошибка при загрузке менеджеров');
            }
        });
    }

    // Загрузка исполнителей в кэш
    function loadExecutorsIntoCache() {
        return $.ajax({
            url: 'http://prj-backend/executors',
            method: 'GET',
            success: function (data) {
                data.forEach(executor => {
                    executorsCache[executor.id] = executor.name;
                });
            },
            error: function () {
                console.error('Ошибка при загрузке исполнителей');
            }
        });
    }

    // Загрузка отчетов
    function loadReports(searchTerm = '') {
        $.ajax({
            url: 'http://prj-backend/reports',
            type: 'GET',
            data: { search: searchTerm },
            dataType: 'json',
            success: function (data) {
                renderReports(data); // Отображаем отчеты
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Ошибка при загрузке отчетов:', textStatus, errorThrown);
                alert('Не удалось загрузить отчеты. Попробуйте еще раз позже.');
            }
        });
    }

    // Функция отображения отчетов
    function renderReports(reports) {
        const reportsContainer = $('.reports__cards');
        reportsContainer.empty(); // Очищаем предыдущие отчеты

        if (reports.length === 0) {
            reportsContainer.append('<div class="no-reports">Нет доступных отчетов.</div>');
            return;
        }

        reports.forEach(report => {
            const projectTitle = projectsCache[report.project_id] || 'Не указано';
            const taskTitle = report.task_name || 'Не указано';
            const managerName = managersCache[report.manager_id] || 'Не указано'; // Используем manager_id
            const executorName = executorsCache[report.executor_id] || 'Не указано'; // Используем executor_id
            const remainingDays = report.remaining_days || 'Не указано';
            const status = report.status || 'Не указан';

            const reportCard = `
                <div class="reports__card">
                    <div class="projects__card-title">Отчёт № ${report.id}</div>
                    <div class="projects__card-manager">Проект: ${projectTitle}</div>
                    <div class="projects__card-task">Задача: ${taskTitle}</div>
                    <div class="projects__card-managers">Руководитель: ${managerName}</div>
                    <div class="projects__card-executor">Исполнитель: ${executorName}</div>
                    <div class="projects__card-time">Осталось: <span class="tasks__card-time-value">${remainingDays}</span> д</div>
                    <div class="projects__card-status">Статус: ${status}</div>
                </div>
            `;
            reportsContainer.append(reportCard); // Добавляем карточку отчета
        });
    }

    // Обработчик события отправки формы поиска
    $('.filter__search').on('submit', function (e) {
        e.preventDefault(); // Предотвращаем стандартное поведение формы
        const searchTerm = $(this).find('input[name="search"]').val(); // Получаем значение поля поиска
        loadReports(searchTerm); // Загружаем отчеты с учетом поискового запроса
    });

    // Обработчик события сброса фильтра
    $('.filter__reset').on('click', function () {
        $('input[name="search"]').val(''); // Очищаем поле поиска
        loadReports(); // Загружаем все отчеты без фильтра
    });

    // Загрузка данных при первом открытии страницы
    Promise.all([loadProjectsIntoCache(), loadManagersIntoCache(), loadExecutorsIntoCache()])
        .then(loadReports)
        .catch(err => console.error('Ошибка загрузки данных:', err));
});
