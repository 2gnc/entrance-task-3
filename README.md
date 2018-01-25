# entrance-task-3

## Установка и запуск

1. в корне проекта выполнить npm install;
2. в /peregovorki выполнить npm install
3. в корне проекта выполнить npm run dev (запустится сервер на http://localhost:3001)
4. в /peregovorki выполнить npm start (запустится сервер на http://localhost:3000)

## Описание решения

### Стек

1. Приложение написано на React, потому что:
	* react прекрасно подходит для SPA
	* react очень хорошо документирован
	* для него есть множество дополнительных решений и библиотек:
		1. интерфейсные компоненты
		2. apollo для взаимодействия с graphQl
2. Для быстрого развертывания инфраструктуры был использован create-react-app, потому что:
	* он тоже отлично документирован
	* можно сэкономить время на настройке webpack
3. Бэкэнд и webpack работают на разных портах localhost (указала proxy для приложения)
4. Для связи приложения и сервера graphql установлен react-apollo 
5. Для того, чтобы можно было принмать запросы от других доменов, для бэкэнда установила cors
6. Использованы следующие сторонние компоненты React и библиотеки: 
	* react-router
	* moment.js - библиотека для работы с датами 
	* react-moment - компоненты для работы с датами 
	* react-datepicker - копмпонент для выбра дат 
	* prop-types
	* react-autocomplete - для подбора пользователей при редактировании событий
	* jquery - для удобства работы с dom и для перерисовки заголовков переговорок в расписании
7. Логика работы приложения реализована в соответствии с заданием со следующими допущеними: 
    * событие не может длиться дольше одного дня
    * нельзя добавить событие, начинающееся раньше 8:00
    * нельзя удалять или редактировать уже прошедшие события
    * в одной комнате в один день не бывает больше двух встреч за один час
    * событие подсвечивается при наведении курсора на любой слот из слотов, занятых событием
    * при создании события через клик на плюсик в расписании, время заполняется
    автоматически только если кликнули по полностью свободному слоту
    * тема встречи должна быть не короче 3-х символов, участников не меньше 1-го, время начала не может быть позже времени окончания, нельзя создать встречу в прошлом
    * валидация полей происходит при попытке сохранить встречу
8. **Не успела сделать на текущий момент**. Все, что указано в этом пункте, актуально на тот момент, когда Вы это читаете. Урок на будущее - тщательней планировать архитектуру приложения, причем до планирования верстки.
    * редактирование существующих встреч ( измененные данные не сохраняются в БД )
    * алгоритм рекомендованных переговорок (выводятся все комнаты, все подготовлено для реализации алгоритма, сейчас заглушка)
    * добавить тесты (с самого начала надо было их добавлять)
    * дополнить код комментариями, сделать рефакторинг
    * сгенерировать JSdoc
