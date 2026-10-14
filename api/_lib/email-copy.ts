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
    subjectQuestionnaire: "We've received your questionnaire — Plan B Concept",
    subjectContact: "We've received your message — Plan B Concept",
    eyebrowQuestionnaire: "Questionnaire received",
    eyebrowContact: "Message received",
    thanks: (n) => `Thank you, ${n}.`,
    introQuestionnaire:
      "Your project questionnaire has reached Anthony Gratton. He reviews every enquiry personally and will be in touch shortly to discuss the next steps.",
    introContact:
      "Your message has reached Anthony Gratton. He reviews every enquiry personally and will be in touch shortly.",
    nextTitle: "What happens next",
    steps: [
      "Anthony reviews the details of your project.",
      "He contacts you to discuss your needs and answer your questions.",
      "If useful, a site visit is arranged on the French Riviera.",
    ],
    recapQuestionnaire: "Summary of your answers",
    recapContact: "Your message",
    notProvided: "Not provided",
    directTitle: "Need to reach Anthony directly?",
    call: "Call",
    footerReason:
      "You are receiving this email because you submitted a form on planb-concept.com. Simply reply to this email to write to Anthony.",
    privacy: "Privacy policy",
  },
  fr: {
    subjectQuestionnaire: "Nous avons bien reçu votre questionnaire — Plan B Concept",
    subjectContact: "Nous avons bien reçu votre message — Plan B Concept",
    eyebrowQuestionnaire: "Questionnaire reçu",
    eyebrowContact: "Message reçu",
    thanks: (n) => `Merci, ${n}.`,
    introQuestionnaire:
      "Votre questionnaire projet a bien été transmis à Anthony Gratton. Il étudie personnellement chaque demande et reviendra vers vous rapidement pour échanger sur la suite.",
    introContact:
      "Votre message a bien été transmis à Anthony Gratton. Il étudie personnellement chaque demande et reviendra vers vous rapidement.",
    nextTitle: "Les prochaines étapes",
    steps: [
      "Anthony étudie les détails de votre projet.",
      "Il vous contacte pour échanger sur vos besoins et répondre à vos questions.",
      "Si nécessaire, une visite sur place est organisée sur la Côte d'Azur.",
    ],
    recapQuestionnaire: "Récapitulatif de vos réponses",
    recapContact: "Votre message",
    notProvided: "Non renseigné",
    directTitle: "Besoin de joindre Anthony directement ?",
    call: "Appeler",
    footerReason:
      "Vous recevez cet e-mail car vous avez rempli un formulaire sur planb-concept.com. Répondez simplement à cet e-mail pour écrire à Anthony.",
    privacy: "Politique de confidentialité",
  },
  nl: {
    subjectQuestionnaire: "Uw vragenlijst is ontvangen — Plan B Concept",
    subjectContact: "Uw bericht is ontvangen — Plan B Concept",
    eyebrowQuestionnaire: "Vragenlijst ontvangen",
    eyebrowContact: "Bericht ontvangen",
    thanks: (n) => `Hartelijk dank, ${n}.`,
    introQuestionnaire:
      "Uw projectvragenlijst is bij Anthony Gratton aangekomen. Hij bekijkt elke aanvraag persoonlijk en neemt binnenkort contact met u op om de volgende stappen te bespreken.",
    introContact:
      "Uw bericht is bij Anthony Gratton aangekomen. Hij bekijkt elke aanvraag persoonlijk en neemt binnenkort contact met u op.",
    nextTitle: "Wat er nu gebeurt",
    steps: [
      "Anthony bekijkt de details van uw project.",
      "Hij neemt contact met u op om uw wensen te bespreken en uw vragen te beantwoorden.",
      "Indien nodig wordt een bezoek ter plaatse aan de Côte d'Azur ingepland.",
    ],
    recapQuestionnaire: "Overzicht van uw antwoorden",
    recapContact: "Uw bericht",
    notProvided: "Niet ingevuld",
    directTitle: "Wilt u Anthony rechtstreeks bereiken?",
    call: "Bellen",
    footerReason:
      "U ontvangt deze e-mail omdat u een formulier heeft ingevuld op planb-concept.com. Beantwoord deze e-mail om Anthony rechtstreeks te schrijven.",
    privacy: "Privacybeleid",
  },
  de: {
    subjectQuestionnaire: "Ihr Fragebogen ist eingegangen — Plan B Concept",
    subjectContact: "Ihre Nachricht ist eingegangen — Plan B Concept",
    eyebrowQuestionnaire: "Fragebogen erhalten",
    eyebrowContact: "Nachricht erhalten",
    thanks: (n) => `Vielen Dank, ${n}.`,
    introQuestionnaire:
      "Ihr Projektfragebogen ist bei Anthony Gratton eingegangen. Er prüft jede Anfrage persönlich und meldet sich in Kürze bei Ihnen, um die nächsten Schritte zu besprechen.",
    introContact:
      "Ihre Nachricht ist bei Anthony Gratton eingegangen. Er prüft jede Anfrage persönlich und meldet sich in Kürze bei Ihnen.",
    nextTitle: "Wie es weitergeht",
    steps: [
      "Anthony prüft die Details Ihres Projekts.",
      "Er kontaktiert Sie, um Ihren Bedarf zu besprechen und Ihre Fragen zu beantworten.",
      "Bei Bedarf wird ein Termin vor Ort an der Côte d'Azur vereinbart.",
    ],
    recapQuestionnaire: "Zusammenfassung Ihrer Angaben",
    recapContact: "Ihre Nachricht",
    notProvided: "Keine Angabe",
    directTitle: "Möchten Sie Anthony direkt erreichen?",
    call: "Anrufen",
    footerReason:
      "Sie erhalten diese E-Mail, weil Sie ein Formular auf planb-concept.com ausgefüllt haben. Antworten Sie einfach auf diese E-Mail, um Anthony zu schreiben.",
    privacy: "Datenschutzerklärung",
  },
  sv: {
    subjectQuestionnaire: "Vi har tagit emot ditt frågeformulär — Plan B Concept",
    subjectContact: "Vi har tagit emot ditt meddelande — Plan B Concept",
    eyebrowQuestionnaire: "Frågeformulär mottaget",
    eyebrowContact: "Meddelande mottaget",
    thanks: (n) => `Tack, ${n}.`,
    introQuestionnaire:
      "Ditt projektformulär har kommit fram till Anthony Gratton. Han går personligen igenom varje förfrågan och hör av sig inom kort för att diskutera nästa steg.",
    introContact:
      "Ditt meddelande har kommit fram till Anthony Gratton. Han går personligen igenom varje förfrågan och hör av sig inom kort.",
    nextTitle: "Så går det till",
    steps: [
      "Anthony går igenom detaljerna i ditt projekt.",
      "Han kontaktar dig för att diskutera dina behov och svara på dina frågor.",
      "Vid behov bokas ett platsbesök på Franska Rivieran.",
    ],
    recapQuestionnaire: "Sammanfattning av dina svar",
    recapContact: "Ditt meddelande",
    notProvided: "Ej angivet",
    directTitle: "Vill du nå Anthony direkt?",
    call: "Ring",
    footerReason:
      "Du får detta e-postmeddelande eftersom du har fyllt i ett formulär på planb-concept.com. Svara bara på detta meddelande för att skriva till Anthony.",
    privacy: "Integritetspolicy",
  },
  da: {
    subjectQuestionnaire: "Vi har modtaget dit spørgeskema — Plan B Concept",
    subjectContact: "Vi har modtaget din besked — Plan B Concept",
    eyebrowQuestionnaire: "Spørgeskema modtaget",
    eyebrowContact: "Besked modtaget",
    thanks: (n) => `Tak, ${n}.`,
    introQuestionnaire:
      "Dit projektspørgeskema er nået frem til Anthony Gratton. Han gennemgår personligt hver henvendelse og kontakter dig snarest for at drøfte de næste skridt.",
    introContact:
      "Din besked er nået frem til Anthony Gratton. Han gennemgår personligt hver henvendelse og kontakter dig snarest.",
    nextTitle: "Det sker der nu",
    steps: [
      "Anthony gennemgår detaljerne i dit projekt.",
      "Han kontakter dig for at drøfte dine behov og besvare dine spørgsmål.",
      "Om nødvendigt aftales et besøg på stedet på den franske Riviera.",
    ],
    recapQuestionnaire: "Oversigt over dine svar",
    recapContact: "Din besked",
    notProvided: "Ikke angivet",
    directTitle: "Vil du kontakte Anthony direkte?",
    call: "Ring",
    footerReason:
      "Du modtager denne e-mail, fordi du har udfyldt en formular på planb-concept.com. Svar blot på denne e-mail for at skrive til Anthony.",
    privacy: "Privatlivspolitik",
  },
  no: {
    subjectQuestionnaire: "Vi har mottatt spørreskjemaet ditt — Plan B Concept",
    subjectContact: "Vi har mottatt meldingen din — Plan B Concept",
    eyebrowQuestionnaire: "Spørreskjema mottatt",
    eyebrowContact: "Melding mottatt",
    thanks: (n) => `Takk, ${n}.`,
    introQuestionnaire:
      "Prosjektskjemaet ditt har kommet fram til Anthony Gratton. Han går personlig gjennom hver henvendelse og tar kontakt med deg snart for å diskutere de neste stegene.",
    introContact:
      "Meldingen din har kommet fram til Anthony Gratton. Han går personlig gjennom hver henvendelse og tar kontakt med deg snart.",
    nextTitle: "Dette skjer videre",
    steps: [
      "Anthony går gjennom detaljene i prosjektet ditt.",
      "Han kontakter deg for å diskutere behovene dine og svare på spørsmålene dine.",
      "Ved behov avtales et besøk på stedet på den franske Rivieraen.",
    ],
    recapQuestionnaire: "Oppsummering av svarene dine",
    recapContact: "Meldingen din",
    notProvided: "Ikke oppgitt",
    directTitle: "Vil du nå Anthony direkte?",
    call: "Ring",
    footerReason:
      "Du mottar denne e-posten fordi du har fylt ut et skjema på planb-concept.com. Bare svar på denne e-posten for å skrive til Anthony.",
    privacy: "Personvernerklæring",
  },
  ru: {
    subjectQuestionnaire: "Ваша анкета получена — Plan B Concept",
    subjectContact: "Ваше сообщение получено — Plan B Concept",
    eyebrowQuestionnaire: "Анкета получена",
    eyebrowContact: "Сообщение получено",
    thanks: (n) => `Спасибо, ${n}.`,
    introQuestionnaire:
      "Ваша анкета проекта передана Энтони Граттону. Он лично рассматривает каждый запрос и в ближайшее время свяжется с вами, чтобы обсудить дальнейшие шаги.",
    introContact:
      "Ваше сообщение передано Энтони Граттону. Он лично рассматривает каждый запрос и в ближайшее время свяжется с вами.",
    nextTitle: "Что будет дальше",
    steps: [
      "Энтони изучит детали вашего проекта.",
      "Он свяжется с вами, чтобы обсудить ваши потребности и ответить на вопросы.",
      "При необходимости будет организован выезд на объект на Лазурном Берегу.",
    ],
    recapQuestionnaire: "Ваши ответы",
    recapContact: "Ваше сообщение",
    notProvided: "Не указано",
    directTitle: "Хотите связаться с Энтони напрямую?",
    call: "Позвонить",
    footerReason:
      "Вы получили это письмо, потому что заполнили форму на сайте planb-concept.com. Просто ответьте на это письмо, чтобы написать Энтони.",
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
