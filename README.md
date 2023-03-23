# Webpack bundler

#### Технологии:
  - Java Script
  - [POSTCSS](https://github.com/postcss/postcss)
  - [Handlebars](https://github.com/handlebars-lang/handlebars.js)

#### Версия node 
`16.18.0`

#### Структура проекта

```bash

|src - "корневая директория с исходниками" 
  |assets - "директория с картинками, видео и другими временными файлами" 
    |favicons
    | img
    | temp
  |components - "папка с компонентами"
    |[componentsName] - "реализация компонента"
    index.js - "файл импорта компонентов (точка входа webpack)"
  |pages - "шаблоны проекта (используется только шаблоны с расширением .hbs)"
    example.hbs
```

#### Разработка
```
npm run dev
```

#### Сборка
```
npm run build
```
Сборка осуществляется в папку `dist`

```bash
|dist
  |assets
    |*
  |bundles - "Файлы стилей и скриптов"
    common.js
    common.css
  example.html
```