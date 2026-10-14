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

## Publikacja

Plan: GitHub Pages z brancha `main` (repo `juliajzzalewska/Zalewski-Automotive`),
ewentualnie później własna domena z OVH.

## Stan prac / następne kroki

- [x] Klucz Web3Forms wklejony (konto web3forms na zalewski.automotive@gmail.com)
- [ ] Przetestować formularz
- [ ] Włączyć GitHub Pages
- [ ] Po publikacji: w panelu Web3Forms zmienić Website URL z `localhost` na adres strony
- [ ] (opcjonalnie) domena
