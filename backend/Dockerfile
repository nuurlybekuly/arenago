FROM python:3.12-slim
WORKDIR /app

# 1. Копируем requirements.txt
COPY requirements.txt .

# 2. Устанавливаем системные библиотеки
RUN apt-get update && \
    apt-get install -y --no-install-recommends libpq-dev gcc && \
    rm -rf /var/lib/apt/lists/*

# 3. pip install
RUN pip install --upgrade pip && pip install -r requirements.txt

# 4. Копируем весь проект
COPY . .

# 5. collectstatic (теперь Django уже установлен)
RUN python manage.py collectstatic --noinput

EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:80"]
