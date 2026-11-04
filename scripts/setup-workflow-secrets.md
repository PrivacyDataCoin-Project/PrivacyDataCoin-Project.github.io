# Refresh Medium news — wymagane secrety

Workflow `.github/workflows/refresh-medium-news.yml` podpisuje commity kluczem `FAB8833900C876FF`.

Dodaj w repo (GitHub → Settings → Secrets and variables → Actions):

1. `ARQTRAS_GPG_PRIVATE_KEY` — eksport klucza prywatnego:
   ```
   gpg --armor --export-secret-keys FAB8833900C876FF
   ```
2. `ARQTRAS_GPG_PASSPHRASE` — hasło do tego klucza (puste, jeśli klucz nie ma hasła).

Po dodaniu secretów workflow sam odświeża `js/news-data.js` co 15 min i przy każdym `workflow_dispatch`.
