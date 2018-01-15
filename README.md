# entrance-task-3

## Установка и запуск

!!! Написать инструкцию !!!

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