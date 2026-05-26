# Как выложить сайт на GitHub Pages

Пошаговая инструкция для папки `v2` (портфолио Vremke).

---

## Что уже подготовлено в проекте

| Файл | Назначение |
|------|------------|
| `.github/workflows/deploy.yml` | Автосборка и публикация при push в `main` |
| `public/.nojekyll` | Корректная отдача файлов на GitHub Pages |
| `scripts/build-pages.mjs` | Ручная сборка с правильным путём `/имя-репо/` |
| `vite.config.js` | Поддержка `VITE_BASE_PATH` для хостинга |

**Не загружаются на GitHub** (уже в `.gitignore`):
- `node_modules/`
- `dist/`

**Обязательно загрузите** ваши фото:
- `public/images/project-01.jpg` … `project-06.jpg`

---

## Способ 1 — Автоматический (рекомендуется)

### Шаг 1. Создайте репозиторий на GitHub

1. Откройте [github.com/new](https://github.com/new)
2. Имя, например: `vremke-portfolio`
3. **Public**
4. Без README / .gitignore (если проект уже локально готов)
5. **Create repository**

Запомните имя — сайт будет по адресу:

`https://ВАШ_ЛОГИН.github.io/vremke-portfolio/`

---

### Шаг 2. Загрузите код с компьютера

Откройте терминал в папке проекта:

```powershell
cd C:\Users\Nikita\Desktop\v2

git init
git add .
git commit -m "Initial commit: portfolio site"
git branch -M main
git remote add origin https://github.com/ВАШ_ЛОГИН/vremke-portfolio.git
git push -u origin main
```

Замените `ВАШ_ЛОГИН` и `vremke-portfolio` на свои значения.

При первом push GitHub попросит войти (логин + токен или GitHub Desktop).

---

### Шаг 3. Включите GitHub Pages

1. Репозиторий → **Settings** → **Pages**
2. **Build and deployment** → Source: **GitHub Actions**
3. Сохраните

---

### Шаг 4. Дождитесь деплоя

1. Вкладка **Actions** → workflow **Deploy to GitHub Pages**
2. Зелёная галочка = сайт опубликован
3. В **Settings → Pages** появится ссылка на сайт

Обычно 1–3 минуты после push.

---

### Шаг 5. Обновления в будущем

```powershell
git add .
git commit -m "Update content"
git push
```

Сайт пересоберётся автоматически.

---

## Способ 2 — Ручная сборка (без Actions)

Если нужно только папку `dist` для загрузки:

```powershell
cd C:\Users\Nikita\Desktop\v2
npm install
npm run build:pages -- vremke-portfolio
```

`vremke-portfolio` — **точное имя** вашего репозитория на GitHub.

Готовые файлы: папка **`dist/`**.

Дальше можно:
- загрузить содержимое `dist` в ветку `gh-pages` через [gh-pages](https://www.npmjs.com/package/gh-pages), или
- использовать **Settings → Pages → Deploy from branch → gh-pages / root**

---

## Проверка перед публикацией

```powershell
npm run build:pages -- vremke-portfolio
npm run preview
```

Откройте адрес из терминала. Если всё ок — картинки, анимации и кнопки работают.

---

## Частые проблемы

### Белый экран / нет стилей

Имя в `npm run build:pages -- ИМЯ` должно **совпадать** с именем репозитория на GitHub.

### Не видны фото в галерее

Файлы должны лежать в `public/images/` и быть закоммичены в git:

```powershell
git add public/images/
git commit -m "Add gallery images"
git push
```

### Сайт не открывается

- Подождите 2–5 минут после первого деплоя
- Проверьте **Actions** — нет ли красной ошибки
- URL: `https://логин.github.io/имя-репозитория/` (со слэшем в конце можно)

---

## Личный домен (опционально)

В `public/` создайте файл `CNAME` с одной строкой:

```
yourdomain.com
```

Закоммитьте и настроить DNS у регистратора (инструкция в GitHub → Pages → Custom domain).

---

## Краткая шпаргалка

```powershell
git init
git add .
git commit -m "Deploy portfolio"
git remote add origin https://github.com/USER/REPO.git
git push -u origin main
```

**Settings → Pages → Source: GitHub Actions** → готово.
