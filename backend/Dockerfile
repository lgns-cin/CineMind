FROM python:3.11

# Otimizando escritas a disco do Python
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

ENV PORT=8000

WORKDIR /cinemind/backend

RUN pip install pipenv

COPY Pipfile Pipfile.lock ./

RUN python -m pipenv install --system --deploy --dev

COPY . .

EXPOSE 8000

# Copia o script de build/entrypoint e garante permissão de execução
COPY build.sh ./
# Ensure shell script line endings are Unix-style and make it executable.
# Some contributors on Windows may commit CRLF endings which cause /bin/bash\r: No such file or directory
RUN sed -i 's/\r$//' ./build.sh && chmod +x ./build.sh

# Não executar migrations/criação de superuser durante o build — isso falha sem o DB.
# O script build.sh (entrypoint) cuidará das migrações em runtime.

ENTRYPOINT ["./build.sh"]
CMD ["python", "src/manage.py", "runserver", "0.0.0.0:8000"]