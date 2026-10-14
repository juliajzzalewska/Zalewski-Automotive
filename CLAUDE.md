# Zalewski Automotive - strona wizytówka

Strona firmy importującej auta z USA. Jeden statyczny plik `index.html`, bez
serwera i bez zależności. Lokalnie: `python -m http.server 8080` i
http://localhost:8080/.

## Formularz kontaktowy - Web3Forms

Formularz wysyła przez `https://api.web3forms.com/submit` (fetch z przeglądarki).
Wiadomości trafiają na zalewski.automotive@gmail.com. Klucz `access_key` jest
w ukrytym polu formularza - Web3Forms jest tak pomyślany, klucz może być
publiczny. Wybrane zamiast Brevo (jak w bozamotane), bo Brevo wymaga serwera
do ukrycia klucza, a tu serwera nie ma.

Nazwy pól formularza (`name`) bez polskich znaków - Web3Forms psuje ich
kodowanie w mailu (wartości są OK).

## Potwierdzenie dla klienta - Google Apps Script

`email/potwierdzenie.gs` - wklejany ręcznie na script.google.com (konto
zalewski.automotive@gmail.com), wdrożony jako Aplikacja internetowa
(wykonuj jako: ja, dostęp: każdy). Strona po sukcesie Web3Forms wysyła te same
dane na adres skryptu (`CONFIRMATION_URL` w `index.html`), skrypt odsyła
klientowi mail HTML w stylu strony z Gmaila firmy. Limit 1 mail na adres na
10 min. Po zmianie pliku: wkleić ponownie i Wdróż → Zarządzaj wdrożeniami →
edytuj → Nowa wersja (adres zostaje ten sam).

## Gmail - stopka i szablony

`email/gmail.html` - strona z przyciskami "Kopiuj" (stopka + 3 szablony
odpowiedzi) i instrukcją wklejenia w Gmailu. Podpis: "Zespół Zalewski
Automotive".

Telefon 505 962 630 to tymczasowo numer Julii - będzie zmieniony. Występuje w:
`email/potwierdzenie.gs` (stała TELEFON), `email/gmail.html` (stopka).

## Publikacja

Plan: GitHub Pages z brancha `main` (repo `juliajzzalewska/Zalewski-Automotive`),
ewentualnie później własna domena z OVH.

## Stan prac / następne kroki

- [x] Klucz Web3Forms wklejony (konto web3forms na zalewski.automotive@gmail.com)
- [x] Przetestować formularz (Web3Forms działa)
- [ ] Wdrożyć `potwierdzenie.gs` w Google i wkleić adres do `CONFIRMATION_URL`
- [ ] Stopka i szablony w Gmailu (z `email/gmail.html`)
- [ ] Włączyć GitHub Pages
- [ ] Po publikacji: w panelu Web3Forms zmienić Website URL z `localhost` na adres strony
- [ ] (opcjonalnie) domena
