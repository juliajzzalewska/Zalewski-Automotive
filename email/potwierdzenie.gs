/**
 * Zalewski Automotive - automatyczne potwierdzenie zapytania dla klienta.
 *
 * Skrypt Google Apps Script podpięty do konta zalewski.automotive@gmail.com.
 * Strona po udanym wysłaniu formularza (Web3Forms) wysyła tu te same dane,
 * a skrypt odsyła klientowi mail z potwierdzeniem - z Gmaila firmy.
 *
 * Wklejany ręcznie na script.google.com i wdrażany jako "Aplikacja internetowa"
 * (instrukcja w CLAUDE.md). Po każdej zmianie tego pliku trzeba go wkleić
 * ponownie i wdrożyć nową wersję.
 */

var FIRMA = 'Zalewski Automotive';
var TELEFON = '505 962 630';
var MAIL = 'zalewski.automotive@gmail.com';
var LIMIT_DZIENNY = 30;

function doPost(e) {
  var p = (e && e.parameter) || {};

  // Pułapka na boty - prawdziwy klient nie widzi i nie zaznacza tego pola
  if (p.botcheck) return odpowiedz('pominieto');

  var email = String(p.email || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return odpowiedz('brak-maila');

  // Nie wysyłaj temu samemu adresowi częściej niż raz na 10 minut
  var cache = CacheService.getScriptCache();
  var klucz = 'wyslano:' + email.toLowerCase();
  if (cache.get(klucz)) return odpowiedz('za-czesto');
  cache.put(klucz, '1', 600);

  // Łączny limit na dobę - adres skryptu jest publiczny, więc chroni Gmaila
  // firmy przed masowym wysyłaniem, gdyby ktoś próbował go nadużyć
  var dzien = 'licznik:' + Utilities.formatDate(new Date(), 'Europe/Warsaw', 'yyyy-MM-dd');
  var props = PropertiesService.getScriptProperties();
  var licznik = Number(props.getProperty(dzien) || 0);
  if (licznik >= LIMIT_DZIENNY) return odpowiedz('limit');
  props.setProperty(dzien, String(licznik + 1));

  var dane = {
    imie: String(p.Klient || '').trim(),
    telefon: String(p.Telefon || '').trim(),
    temat: String(p.Temat || '').trim(),
    preferencje: String(p.Preferencje || '').trim()
  };

  MailApp.sendEmail({
    to: email,
    subject: 'Dziękujemy za zapytanie - ' + FIRMA,
    name: FIRMA,
    replyTo: MAIL,
    htmlBody: mailHtml(dane),
    body: mailTekst(dane)
  });

  return odpowiedz('wyslano');
}

function odpowiedz(status) {
  return ContentService.createTextOutput(JSON.stringify({ status: status }))
    .setMimeType(ContentService.MimeType.JSON);
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/\n/g, '<br>');
}

function wiersz(etykieta, wartosc) {
  if (!wartosc) return '';
  return '<tr>' +
    '<td style="padding:10px 0;border-bottom:1px solid #232833;color:#7A8090;font-size:12px;letter-spacing:1px;text-transform:uppercase;width:130px;vertical-align:top;">' + etykieta + '</td>' +
    '<td style="padding:10px 0;border-bottom:1px solid #232833;color:#F4F1EC;font-size:15px;vertical-align:top;">' + esc(wartosc) + '</td>' +
    '</tr>';
}

function mailHtml(d) {
  var powitanie = d.imie ? 'Dzień dobry, ' + esc(d.imie) + '!' : 'Dzień dobry!';
  var podsumowanie =
    wiersz('Temat', d.temat) +
    wiersz('Telefon', d.telefon) +
    wiersz('Preferencje', d.preferencje);

  return '' +
  '<!doctype html><html><body style="margin:0;padding:0;background:#080A0F;">' +
  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#080A0F;">' +
  '<tr><td align="center" style="padding:32px 16px;">' +
  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#10141C;border:1px solid #232833;font-family:Arial,Helvetica,sans-serif;">' +

    // Nagłówek z logo
    '<tr><td style="padding:28px 32px;border-bottom:2px solid #C9A84C;">' +
      '<table role="presentation" cellpadding="0" cellspacing="0"><tr>' +
        '<td style="width:40px;height:40px;border:1px solid #C9A84C;text-align:center;vertical-align:middle;font-family:\'Arial Black\',Arial,sans-serif;font-weight:900;font-size:17px;color:#C9A84C;">ZA</td>' +
        '<td style="padding-left:14px;font-family:Impact,\'Arial Narrow\',Arial,sans-serif;font-size:24px;letter-spacing:2px;color:#F4F1EC;text-transform:uppercase;">Zalewski <span style="color:#C9A84C;">Automotive</span></td>' +
      '</tr></table>' +
    '</td></tr>' +

    // Treść
    '<tr><td style="padding:32px;">' +
      '<p style="margin:0 0 6px;color:#C9A84C;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Zapytanie przyjęte</p>' +
      '<h1 style="margin:0 0 18px;color:#F4F1EC;font-size:24px;font-weight:bold;">' + powitanie + '</h1>' +
      '<p style="margin:0 0 14px;color:#C9CCD4;font-size:15px;line-height:1.6;">Dziękujemy za kontakt z Zalewski Automotive. Otrzymaliśmy Twoje zapytanie i odezwiemy się najszybciej, jak to możliwe - zwykle w ciągu jednego dnia roboczego.</p>' +
      (podsumowanie
        ? '<p style="margin:24px 0 4px;color:#7A8090;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Twoje zapytanie</p>' +
          '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' + podsumowanie + '</table>'
        : '') +
      '<p style="margin:24px 0 0;color:#C9CCD4;font-size:15px;line-height:1.6;">Jeśli chcesz coś dodać, po prostu odpowiedz na tego maila albo zadzwoń.</p>' +
    '</td></tr>' +

    // Kontakt
    '<tr><td style="padding:22px 32px;background:#141820;border-top:1px solid #232833;">' +
      '<p style="margin:0 0 4px;color:#F4F1EC;font-size:15px;font-weight:bold;">Zespół Zalewski Automotive</p>' +
      '<p style="margin:0;color:#7A8090;font-size:13px;line-height:1.7;">Import pojazdów z USA<br>' +
        'tel. <a href="tel:+48' + TELEFON.replace(/\s/g, '') + '" style="color:#C9A84C;text-decoration:none;">' + TELEFON + '</a><br>' +
        '<a href="mailto:' + MAIL + '" style="color:#C9A84C;text-decoration:none;">' + MAIL + '</a></p>' +
    '</td></tr>' +

  '</table>' +
  '<p style="margin:16px 0 0;color:#4A505C;font-size:11px;font-family:Arial,Helvetica,sans-serif;">Ten mail został wysłany automatycznie po wypełnieniu formularza na naszej stronie.</p>' +
  '</td></tr></table></body></html>';
}

function mailTekst(d) {
  return (d.imie ? 'Dzień dobry, ' + d.imie + '!' : 'Dzień dobry!') + '\n\n' +
    'Dziękujemy za kontakt z Zalewski Automotive. Otrzymaliśmy Twoje zapytanie ' +
    'i odezwiemy się najszybciej, jak to możliwe - zwykle w ciągu jednego dnia roboczego.\n\n' +
    (d.temat ? 'Temat: ' + d.temat + '\n' : '') +
    (d.telefon ? 'Telefon: ' + d.telefon + '\n' : '') +
    (d.preferencje ? 'Preferencje: ' + d.preferencje + '\n' : '') +
    '\nJeśli chcesz coś dodać, po prostu odpowiedz na tego maila albo zadzwoń.\n\n' +
    'Zespół Zalewski Automotive\nImport pojazdów z USA\ntel. ' + TELEFON + '\n' + MAIL;
}

/**
 * Do jednorazowego uruchomienia w edytorze (przycisk "Uruchom"):
 * nadaje skryptowi uprawnienia i wysyła próbny mail na adres firmy.
 */
function testPotwierdzenia() {
  doPost({ parameter: {
    email: MAIL,
    Klient: 'Test',
    Telefon: '505 962 630',
    Temat: 'Konkretny model - chcę porozmawiać',
    Preferencje: 'BMW X5 2020+, budżet ok. 80 000 PLN'
  }});
}
