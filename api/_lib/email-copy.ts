// Visitor confirmation email copy, one entry per site language. Field labels and option
// values come from the site's own locale files (src/i18n/locales); this file only holds
// the text that exists nowhere else on the site.

export type ConfirmationCopy = {
  subjectQuestionnaire: string;
  subjectContact: string;
  eyebrowQuestionnaire: string;
  eyebrowContact: string;
  thanks: (name: string) => string;
  introQuestionnaire: string;
  introContact: string;
  nextTitle: string;
  steps: [string, string, string];
  recapQuestionnaire: string;
  recapContact: string;
  notProvided: string;
  directTitle: string;
  call: string;
  footerReason: string;
  privacy: string;
};

export const CONFIRMATION_COPY: Record<string, ConfirmationCopy> = {
  en: {
    subjectQuestionnaire: "I've received your questionnaire — Plan B Concept",
    subjectContact: "I've received your message — Plan B Concept",
    eyebrowQuestionnaire: "Questionnaire received",
    eyebrowContact: "Message received",
    thanks: (n) => `Thank you, ${n}.`,
    introQuestionnaire:
      "Your project questionnaire is with me. I review every enquiry personally and will be in touch shortly to discuss the next steps.",
    introContact:
      "Your message is with me. I review every enquiry personally and will be in touch shortly.",
    nextTitle: "What happens next",
    steps: [
      "I review the details of your project.",
      "I contact you to discuss your needs and answer your questions.",
      "If useful, I arrange a site visit on the French Riviera.",
    ],
    recapQuestionnaire: "Summary of your answers",
    recapContact: "Your details",
    notProvided: "Not provided",
    directTitle: "Need to reach me directly?",
    call: "Call",
    footerReason:
      "You are receiving this email because you submitted a form on planb-concept.com. Simply reply to this email to write to me.",
    privacy: "Privacy policy",
  },
  fr: {
    subjectQuestionnaire: "J'ai bien reçu votre questionnaire — Plan B Concept",
    subjectContact: "J'ai bien reçu votre message — Plan B Concept",
    eyebrowQuestionnaire: "Questionnaire reçu",
    eyebrowContact: "Message reçu",
    thanks: (n) => `Merci, ${n}.`,
    introQuestionnaire:
      "Votre questionnaire projet m'est bien parvenu. J'étudie personnellement chaque demande et reviendrai vers vous rapidement pour échanger sur la suite.",
    introContact:
      "Votre message m'est bien parvenu. J'étudie personnellement chaque demande et reviendrai vers vous rapidement.",
    nextTitle: "Les prochaines étapes",
    steps: [
      "J'étudie les détails de votre projet.",
      "Je vous contacte pour échanger sur vos besoins et répondre à vos questions.",
      "Si nécessaire, j'organise une visite sur place sur la Côte d'Azur.",
    ],
    recapQuestionnaire: "Récapitulatif de vos réponses",
    recapContact: "Vos coordonnées",
    notProvided: "Non renseigné",
    directTitle: "Besoin de me joindre directement ?",
    call: "Appeler",
    footerReason:
      "Vous recevez cet e-mail car vous avez rempli un formulaire sur planb-concept.com. Répondez simplement à cet e-mail pour m'écrire.",
    privacy: "Politique de confidentialité",
  },
  nl: {
    subjectQuestionnaire: "Uw vragenlijst is ontvangen — Plan B Concept",
    subjectContact: "Uw bericht is ontvangen — Plan B Concept",
    eyebrowQuestionnaire: "Vragenlijst ontvangen",
    eyebrowContact: "Bericht ontvangen",
    thanks: (n) => `Hartelijk dank, ${n}.`,
    introQuestionnaire:
      "Uw projectvragenlijst is bij mij aangekomen. Ik bekijk elke aanvraag persoonlijk en neem binnenkort contact met u op om de volgende stappen te bespreken.",
    introContact:
      "Uw bericht is bij mij aangekomen. Ik bekijk elke aanvraag persoonlijk en neem binnenkort contact met u op.",
    nextTitle: "Wat er nu gebeurt",
    steps: [
      "Ik bekijk de details van uw project.",
      "Ik neem contact met u op om uw wensen te bespreken en uw vragen te beantwoorden.",
      "Indien nodig plan ik een bezoek ter plaatse aan de Côte d'Azur in.",
    ],
    recapQuestionnaire: "Overzicht van uw antwoorden",
    recapContact: "Uw gegevens",
    notProvided: "Niet ingevuld",
    directTitle: "Wilt u mij rechtstreeks bereiken?",
    call: "Bellen",
    footerReason:
      "U ontvangt deze e-mail omdat u een formulier heeft ingevuld op planb-concept.com. Beantwoord deze e-mail om mij rechtstreeks te schrijven.",
    privacy: "Privacybeleid",
  },
  de: {
    subjectQuestionnaire: "Ihr Fragebogen ist eingegangen — Plan B Concept",
    subjectContact: "Ihre Nachricht ist eingegangen — Plan B Concept",
    eyebrowQuestionnaire: "Fragebogen erhalten",
    eyebrowContact: "Nachricht erhalten",
    thanks: (n) => `Vielen Dank, ${n}.`,
    introQuestionnaire:
      "Ihr Projektfragebogen ist bei mir eingegangen. Ich prüfe jede Anfrage persönlich und melde mich in Kürze bei Ihnen, um die nächsten Schritte zu besprechen.",
    introContact:
      "Ihre Nachricht ist bei mir eingegangen. Ich prüfe jede Anfrage persönlich und melde mich in Kürze bei Ihnen.",
    nextTitle: "Wie es weitergeht",
    steps: [
      "Ich prüfe die Details Ihres Projekts.",
      "Ich kontaktiere Sie, um Ihren Bedarf zu besprechen und Ihre Fragen zu beantworten.",
      "Bei Bedarf vereinbare ich einen Termin vor Ort an der Côte d'Azur.",
    ],
    recapQuestionnaire: "Zusammenfassung Ihrer Angaben",
    recapContact: "Ihre Angaben",
    notProvided: "Keine Angabe",
    directTitle: "Möchten Sie mich direkt erreichen?",
    call: "Anrufen",
    footerReason:
      "Sie erhalten diese E-Mail, weil Sie ein Formular auf planb-concept.com ausgefüllt haben. Antworten Sie einfach auf diese E-Mail, um mir zu schreiben.",
    privacy: "Datenschutzerklärung",
  },
  sv: {
    subjectQuestionnaire: "Jag har tagit emot ditt frågeformulär — Plan B Concept",
    subjectContact: "Jag har tagit emot ditt meddelande — Plan B Concept",
    eyebrowQuestionnaire: "Frågeformulär mottaget",
    eyebrowContact: "Meddelande mottaget",
    thanks: (n) => `Tack, ${n}.`,
    introQuestionnaire:
      "Ditt projektformulär har kommit fram till mig. Jag går personligen igenom varje förfrågan och hör av mig inom kort för att diskutera nästa steg.",
    introContact:
      "Ditt meddelande har kommit fram till mig. Jag går personligen igenom varje förfrågan och hör av mig inom kort.",
    nextTitle: "Så går det till",
    steps: [
      "Jag går igenom detaljerna i ditt projekt.",
      "Jag kontaktar dig för att diskutera dina behov och svara på dina frågor.",
      "Vid behov bokar jag ett platsbesök på Franska Rivieran.",
    ],
    recapQuestionnaire: "Sammanfattning av dina svar",
    recapContact: "Dina uppgifter",
    notProvided: "Ej angivet",
    directTitle: "Vill du nå mig direkt?",
    call: "Ring",
    footerReason:
      "Du får detta e-postmeddelande eftersom du har fyllt i ett formulär på planb-concept.com. Svara bara på detta meddelande för att skriva till mig.",
    privacy: "Integritetspolicy",
  },
  da: {
    subjectQuestionnaire: "Jeg har modtaget dit spørgeskema — Plan B Concept",
    subjectContact: "Jeg har modtaget din besked — Plan B Concept",
    eyebrowQuestionnaire: "Spørgeskema modtaget",
    eyebrowContact: "Besked modtaget",
    thanks: (n) => `Tak, ${n}.`,
    introQuestionnaire:
      "Dit projektspørgeskema er nået frem til mig. Jeg gennemgår personligt hver henvendelse og kontakter dig snarest for at drøfte de næste skridt.",
    introContact:
      "Din besked er nået frem til mig. Jeg gennemgår personligt hver henvendelse og kontakter dig snarest.",
    nextTitle: "Det sker der nu",
    steps: [
      "Jeg gennemgår detaljerne i dit projekt.",
      "Jeg kontakter dig for at drøfte dine behov og besvare dine spørgsmål.",
      "Om nødvendigt aftaler jeg et besøg på stedet på den franske Riviera.",
    ],
    recapQuestionnaire: "Oversigt over dine svar",
    recapContact: "Dine oplysninger",
    notProvided: "Ikke angivet",
    directTitle: "Vil du kontakte mig direkte?",
    call: "Ring",
    footerReason:
      "Du modtager denne e-mail, fordi du har udfyldt en formular på planb-concept.com. Svar blot på denne e-mail for at skrive til mig.",
    privacy: "Privatlivspolitik",
  },
  no: {
    subjectQuestionnaire: "Jeg har mottatt spørreskjemaet ditt — Plan B Concept",
    subjectContact: "Jeg har mottatt meldingen din — Plan B Concept",
    eyebrowQuestionnaire: "Spørreskjema mottatt",
    eyebrowContact: "Melding mottatt",
    thanks: (n) => `Takk, ${n}.`,
    introQuestionnaire:
      "Prosjektskjemaet ditt har kommet fram til meg. Jeg går personlig gjennom hver henvendelse og tar kontakt med deg snart for å diskutere de neste stegene.",
    introContact:
      "Meldingen din har kommet fram til meg. Jeg går personlig gjennom hver henvendelse og tar kontakt med deg snart.",
    nextTitle: "Dette skjer videre",
    steps: [
      "Jeg går gjennom detaljene i prosjektet ditt.",
      "Jeg kontakter deg for å diskutere behovene dine og svare på spørsmålene dine.",
      "Ved behov avtaler jeg et besøk på stedet på den franske Rivieraen.",
    ],
    recapQuestionnaire: "Oppsummering av svarene dine",
    recapContact: "Dine opplysninger",
    notProvided: "Ikke oppgitt",
    directTitle: "Vil du nå meg direkte?",
    call: "Ring",
    footerReason:
      "Du mottar denne e-posten fordi du har fylt ut et skjema på planb-concept.com. Bare svar på denne e-posten for å skrive til meg.",
    privacy: "Personvernerklæring",
  },
  ru: {
    subjectQuestionnaire: "Ваша анкета получена — Plan B Concept",
    subjectContact: "Ваше сообщение получено — Plan B Concept",
    eyebrowQuestionnaire: "Анкета получена",
    eyebrowContact: "Сообщение получено",
    thanks: (n) => `Спасибо, ${n}.`,
    introQuestionnaire:
      "Я получил вашу анкету проекта. Я лично рассматриваю каждый запрос и в ближайшее время свяжусь с вами, чтобы обсудить дальнейшие шаги.",
    introContact:
      "Я получил ваше сообщение. Я лично рассматриваю каждый запрос и в ближайшее время свяжусь с вами.",
    nextTitle: "Что будет дальше",
    steps: [
      "Я изучу детали вашего проекта.",
      "Я свяжусь с вами, чтобы обсудить ваши потребности и ответить на вопросы.",
      "При необходимости я организую выезд на объект на Лазурном Берегу.",
    ],
    recapQuestionnaire: "Ваши ответы",
    recapContact: "Ваши данные",
    notProvided: "Не указано",
    directTitle: "Хотите связаться со мной напрямую?",
    call: "Позвонить",
    footerReason:
      "Вы получили это письмо, потому что заполнили форму на сайте planb-concept.com. Просто ответьте на это письмо, чтобы написать мне.",
    privacy: "Политика конфиденциальности",
  },
};

// French language names, for telling Anthony which language the visitor used.
export const LANGUAGE_NAMES_FR: Record<string, string> = {
  en: "anglais",
  fr: "français",
  nl: "néerlandais",
  de: "allemand",
  sv: "suédois",
  da: "danois",
  no: "norvégien",
  ru: "russe",
};
