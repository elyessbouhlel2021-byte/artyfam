const fr = {
  nav: { home: "Accueil", shop: "Boutique", categories: "Catégories", contact: "Contact", faq: "FAQ", cart: "Panier", search: "Rechercher", menu: "Menu" },
  common: {
    searchPlaceholder: "Rechercher un produit…", viewAll: "Tout voir", shopNow: "Découvrir", addToCart: "Ajouter au panier",
    added: "Ajouté au panier", close: "Fermer", back: "Retour", language: "Langue", market: "Marché", theme: "Thème",
    lightMode: "Mode clair", darkMode: "Mode sombre", imagePending: "Image à venir", new: "Nouveau", sale: "Promo",
    inStock: "Disponible", lowStock: "Bientôt épuisé", outOfStock: "Indisponible", previous: "Précédent", next: "Suivant",
    page: "Page", products: "produits", results: "résultats", logoPlaceholder: "Logo officiel à ajouter",
  },
  market: {
    chooseTitle: "Choisissez votre marché", chooseText: "Les prix et la livraison s'adaptent à votre pays. Vous pourrez changer ce choix à tout moment.",
    TN: "Tunisie", IT: "Italie", confirm: "Continuer",
  },
  home: {
    heroEyebrow: "Maison ARTYFAM", heroTitle: "L'essentiel, choisi avec exigence.",
    heroText: "Vêtements, chaussures, sacs et objets du quotidien — sélectionnés pour la Tunisie et l'Italie.",
    categories: "Nos catégories", newArrivals: "Nouveautés", featured: "Sélection", popular: "Catégories populaires", all: "Tous les produits",
  },
  filters: {
    title: "Filtres", category: "Catégorie", allCategories: "Toutes", price: "Prix", min: "Min", max: "Max", size: "Taille",
    color: "Couleur", promoOnly: "Promotions uniquement", sort: "Trier", newest: "Nouveautés", priceAsc: "Prix croissant",
    priceDesc: "Prix décroissant", reset: "Réinitialiser les filtres", apply: "Appliquer", noResults: "Aucun produit trouvé",
    noResultsText: "Essayez d'ajuster vos filtres ou votre recherche.", searchFor: "Résultats pour",
  },
  product: {
    color: "Couleur", size: "Taille / pointure", quantity: "Quantité", description: "Description", related: "Vous aimerez aussi",
    selectSize: "Veuillez choisir une taille", notFound: "Produit introuvable", decrease: "Diminuer", increase: "Augmenter",
  },
  cart: {
    title: "Votre panier", empty: "Votre panier est vide", emptyText: "Parcourez la boutique pour trouver votre bonheur.",
    product: "Produit", unitPrice: "Prix unitaire", lineTotal: "Total", remove: "Retirer", subtotal: "Sous-total",
    delivery: "Livraison", free: "Offerte", total: "Total", checkout: "Passer commande", continue: "Continuer mes achats",
    freeFrom: "Livraison offerte dès", remaining: "Plus que {amount} pour la livraison offerte",
  },
  checkout: {
    title: "Finaliser la commande", contact: "Coordonnées de livraison", firstName: "Prénom", lastName: "Nom", country: "Pays",
    region: "Région / province", address: "Adresse détaillée", phone: "Téléphone", payment: "Mode de paiement",
    cod: "Paiement à la livraison", codText: "Vous payez en espèces à la réception de votre commande.",
    summary: "Récapitulatif", place: "Confirmer la commande", placing: "Envoi en cours…", selectRegion: "Sélectionner",
    previewNotice: "Aperçu de l'interface : aucune commande n'est enregistrée pour le moment.",
    previewState: "État d'aperçu", previewSuccess: "Succès", previewError: "Erreur",
    errorTitle: "La commande n'a pas pu être envoyée", errorText: "Aperçu d'erreur — veuillez réessayer plus tard.",
  },
  validation: {
    required: "Ce champ est obligatoire", phone: "Numéro de téléphone invalide", min: "Trop court", fixErrors: "Veuillez corriger les champs indiqués.",
  },
  confirmation: {
    title: "Aperçu de confirmation", reference: "Référence d'aperçu",
    text: "Ceci est un aperçu de l'écran de confirmation. Aucune commande n'a été enregistrée ni transmise.",
    back: "Retour à la boutique",
  },
  footer: {
    tagline: "Une sélection soignée pour la Tunisie et l'Italie.", help: "Aide", policies: "Informations", follow: "Suivez-nous",
    shipping: "Livraison", returns: "Retours", privacy: "Confidentialité", terms: "Conditions générales", rights: "Tous droits réservés.",
    contactPending: "Coordonnées à configurer", socialPending: "Réseaux sociaux à venir",
  },
  whatsapp: { label: "Contact WhatsApp", disabled: "WhatsApp bientôt disponible" },
  pages: {
    contactTitle: "Contact", contactText: "Une question sur un produit ou une commande ? Écrivez-nous.",
    name: "Nom", email: "E-mail", message: "Message", send: "Envoyer", sentPreview: "Aperçu : le message n'est pas encore envoyé.",
    faqTitle: "Questions fréquentes",
    faq: [
      ["Quels sont les délais de livraison ?", "Les délais dépendent de votre région. Ils seront précisés lors de la confirmation de commande."],
      ["Comment payer ma commande ?", "Le paiement s'effectue en espèces à la livraison."],
      ["Puis-je retourner un article ?", "Oui, consultez notre page Retours pour les conditions."],
      ["Livrez-vous en Italie ?", "Oui, ARTYFAM sert la Tunisie et l'Italie avec des prix adaptés à chaque marché."],
    ] as [string, string][],
    shippingTitle: "Livraison", returnsTitle: "Retours & échanges", privacyTitle: "Politique de confidentialité", termsTitle: "Conditions générales de vente",
    policyPlaceholder: "Contenu provisoire. Le texte officiel de cette page sera fourni et publié par ARTYFAM.",
  },
  notFound: { title: "Page introuvable", text: "La page demandée n'existe pas.", home: "Retour à l'accueil" },
};

export type Dict = typeof fr;

const it: Dict = {
  nav: { home: "Home", shop: "Negozio", categories: "Categorie", contact: "Contatti", faq: "FAQ", cart: "Carrello", search: "Cerca", menu: "Menu" },
  common: {
    searchPlaceholder: "Cerca un prodotto…", viewAll: "Vedi tutto", shopNow: "Scopri", addToCart: "Aggiungi al carrello",
    added: "Aggiunto al carrello", close: "Chiudi", back: "Indietro", language: "Lingua", market: "Mercato", theme: "Tema",
    lightMode: "Modalità chiara", darkMode: "Modalità scura", imagePending: "Immagine in arrivo", new: "Novità", sale: "Promo",
    inStock: "Disponibile", lowStock: "Quasi esaurito", outOfStock: "Non disponibile", previous: "Precedente", next: "Successiva",
    page: "Pagina", products: "prodotti", results: "risultati", logoPlaceholder: "Logo ufficiale da aggiungere",
  },
  market: {
    chooseTitle: "Scegli il tuo mercato", chooseText: "Prezzi e spedizione si adattano al tuo paese. Potrai cambiare questa scelta in qualsiasi momento.",
    TN: "Tunisia", IT: "Italia", confirm: "Continua",
  },
  home: {
    heroEyebrow: "Maison ARTYFAM", heroTitle: "L'essenziale, scelto con cura.",
    heroText: "Abbigliamento, scarpe, borse e oggetti quotidiani — selezionati per la Tunisia e l'Italia.",
    categories: "Le nostre categorie", newArrivals: "Nuovi arrivi", featured: "Selezione", popular: "Categorie popolari", all: "Tutti i prodotti",
  },
  filters: {
    title: "Filtri", category: "Categoria", allCategories: "Tutte", price: "Prezzo", min: "Min", max: "Max", size: "Taglia",
    color: "Colore", promoOnly: "Solo promozioni", sort: "Ordina", newest: "Novità", priceAsc: "Prezzo crescente",
    priceDesc: "Prezzo decrescente", reset: "Azzera filtri", apply: "Applica", noResults: "Nessun prodotto trovato",
    noResultsText: "Prova a modificare i filtri o la ricerca.", searchFor: "Risultati per",
  },
  product: {
    color: "Colore", size: "Taglia / numero", quantity: "Quantità", description: "Descrizione", related: "Potrebbe piacerti",
    selectSize: "Seleziona una taglia", notFound: "Prodotto non trovato", decrease: "Diminuisci", increase: "Aumenta",
  },
  cart: {
    title: "Il tuo carrello", empty: "Il carrello è vuoto", emptyText: "Esplora il negozio per trovare ciò che ami.",
    product: "Prodotto", unitPrice: "Prezzo unitario", lineTotal: "Totale", remove: "Rimuovi", subtotal: "Subtotale",
    delivery: "Spedizione", free: "Gratuita", total: "Totale", checkout: "Procedi all'ordine", continue: "Continua lo shopping",
    freeFrom: "Spedizione gratuita da", remaining: "Mancano {amount} per la spedizione gratuita",
  },
  checkout: {
    title: "Completa l'ordine", contact: "Dati di consegna", firstName: "Nome", lastName: "Cognome", country: "Paese",
    region: "Regione / provincia", address: "Indirizzo completo", phone: "Telefono", payment: "Metodo di pagamento",
    cod: "Pagamento alla consegna", codText: "Paghi in contanti al ricevimento dell'ordine.",
    summary: "Riepilogo", place: "Conferma ordine", placing: "Invio in corso…", selectRegion: "Seleziona",
    previewNotice: "Anteprima dell'interfaccia: al momento nessun ordine viene registrato.",
    previewState: "Stato anteprima", previewSuccess: "Successo", previewError: "Errore",
    errorTitle: "Impossibile inviare l'ordine", errorText: "Anteprima di errore — riprova più tardi.",
  },
  validation: {
    required: "Campo obbligatorio", phone: "Numero di telefono non valido", min: "Troppo corto", fixErrors: "Correggi i campi indicati.",
  },
  confirmation: {
    title: "Anteprima di conferma", reference: "Riferimento anteprima",
    text: "Questa è un'anteprima della schermata di conferma. Nessun ordine è stato registrato o inviato.",
    back: "Torna al negozio",
  },
  footer: {
    tagline: "Una selezione curata per la Tunisia e l'Italia.", help: "Assistenza", policies: "Informazioni", follow: "Seguici",
    shipping: "Spedizione", returns: "Resi", privacy: "Privacy", terms: "Termini e condizioni", rights: "Tutti i diritti riservati.",
    contactPending: "Contatti da configurare", socialPending: "Social in arrivo",
  },
  whatsapp: { label: "Contatto WhatsApp", disabled: "WhatsApp presto disponibile" },
  pages: {
    contactTitle: "Contatti", contactText: "Una domanda su un prodotto o un ordine? Scrivici.",
    name: "Nome", email: "E-mail", message: "Messaggio", send: "Invia", sentPreview: "Anteprima: il messaggio non viene ancora inviato.",
    faqTitle: "Domande frequenti",
    faq: [
      ["Quali sono i tempi di consegna?", "I tempi dipendono dalla tua zona e saranno indicati alla conferma dell'ordine."],
      ["Come posso pagare?", "Il pagamento avviene in contanti alla consegna."],
      ["Posso restituire un articolo?", "Sì, consulta la pagina Resi per le condizioni."],
      ["Spedite in Tunisia?", "Sì, ARTYFAM serve Tunisia e Italia con prezzi adattati a ciascun mercato."],
    ],
    shippingTitle: "Spedizione", returnsTitle: "Resi e cambi", privacyTitle: "Informativa sulla privacy", termsTitle: "Condizioni generali di vendita",
    policyPlaceholder: "Contenuto provvisorio. Il testo ufficiale di questa pagina sarà fornito e pubblicato da ARTYFAM.",
  },
  notFound: { title: "Pagina non trovata", text: "La pagina richiesta non esiste.", home: "Torna alla home" },
};

const ar: Dict = {
  nav: { home: "الرئيسية", shop: "المتجر", categories: "الفئات", contact: "اتصل بنا", faq: "الأسئلة الشائعة", cart: "السلة", search: "بحث", menu: "القائمة" },
  common: {
    searchPlaceholder: "ابحث عن منتج…", viewAll: "عرض الكل", shopNow: "اكتشف", addToCart: "أضف إلى السلة",
    added: "تمت الإضافة إلى السلة", close: "إغلاق", back: "رجوع", language: "اللغة", market: "السوق", theme: "المظهر",
    lightMode: "الوضع الفاتح", darkMode: "الوضع الداكن", imagePending: "الصورة قريباً", new: "جديد", sale: "تخفيض",
    inStock: "متوفر", lowStock: "كمية محدودة", outOfStock: "غير متوفر", previous: "السابق", next: "التالي",
    page: "صفحة", products: "منتجات", results: "نتائج", logoPlaceholder: "يُضاف الشعار الرسمي",
  },
  market: {
    chooseTitle: "اختر سوقك", chooseText: "تتكيف الأسعار والتوصيل مع بلدك. يمكنك تغيير هذا الاختيار في أي وقت.",
    TN: "تونس", IT: "إيطاليا", confirm: "متابعة",
  },
  home: {
    heroEyebrow: "دار ARTYFAM", heroTitle: "الأساسيات، مختارة بعناية.",
    heroText: "ملابس وأحذية وحقائب وأغراض يومية — مختارة لتونس وإيطاليا.",
    categories: "فئاتنا", newArrivals: "وصل حديثاً", featured: "مختارات", popular: "الفئات الأكثر رواجاً", all: "جميع المنتجات",
  },
  filters: {
    title: "التصفية", category: "الفئة", allCategories: "الكل", price: "السعر", min: "الأدنى", max: "الأقصى", size: "المقاس",
    color: "اللون", promoOnly: "العروض فقط", sort: "ترتيب", newest: "الأحدث", priceAsc: "السعر تصاعدياً",
    priceDesc: "السعر تنازلياً", reset: "إعادة ضبط التصفية", apply: "تطبيق", noResults: "لم يتم العثور على منتجات",
    noResultsText: "حاول تعديل التصفية أو البحث.", searchFor: "نتائج البحث عن",
  },
  product: {
    color: "اللون", size: "المقاس", quantity: "الكمية", description: "الوصف", related: "قد يعجبك أيضاً",
    selectSize: "يرجى اختيار المقاس", notFound: "المنتج غير موجود", decrease: "إنقاص", increase: "زيادة",
  },
  cart: {
    title: "سلة التسوق", empty: "سلتك فارغة", emptyText: "تصفح المتجر لتجد ما يعجبك.",
    product: "المنتج", unitPrice: "سعر الوحدة", lineTotal: "المجموع", remove: "إزالة", subtotal: "المجموع الفرعي",
    delivery: "التوصيل", free: "مجاني", total: "الإجمالي", checkout: "إتمام الطلب", continue: "متابعة التسوق",
    freeFrom: "توصيل مجاني ابتداءً من", remaining: "تبقى {amount} للحصول على توصيل مجاني",
  },
  checkout: {
    title: "إتمام الطلب", contact: "معلومات التوصيل", firstName: "الاسم", lastName: "اللقب", country: "البلد",
    region: "الولاية / المقاطعة", address: "العنوان المفصل", phone: "الهاتف", payment: "طريقة الدفع",
    cod: "الدفع عند الاستلام", codText: "تدفع نقداً عند استلام طلبك.",
    summary: "ملخص الطلب", place: "تأكيد الطلب", placing: "جارٍ الإرسال…", selectRegion: "اختر",
    previewNotice: "معاينة للواجهة: لا يتم حفظ أي طلب حالياً.",
    previewState: "حالة المعاينة", previewSuccess: "نجاح", previewError: "خطأ",
    errorTitle: "تعذر إرسال الطلب", errorText: "معاينة خطأ — يرجى المحاولة لاحقاً.",
  },
  validation: {
    required: "هذا الحقل مطلوب", phone: "رقم الهاتف غير صالح", min: "قصير جداً", fixErrors: "يرجى تصحيح الحقول المشار إليها.",
  },
  confirmation: {
    title: "معاينة التأكيد", reference: "مرجع المعاينة",
    text: "هذه معاينة لشاشة التأكيد. لم يتم حفظ أو إرسال أي طلب.",
    back: "العودة إلى المتجر",
  },
  footer: {
    tagline: "تشكيلة مختارة بعناية لتونس وإيطاليا.", help: "المساعدة", policies: "معلومات", follow: "تابعنا",
    shipping: "التوصيل", returns: "الإرجاع", privacy: "الخصوصية", terms: "الشروط والأحكام", rights: "جميع الحقوق محفوظة.",
    contactPending: "معلومات الاتصال قيد الإعداد", socialPending: "الشبكات الاجتماعية قريباً",
  },
  whatsapp: { label: "تواصل عبر واتساب", disabled: "واتساب متاح قريباً" },
  pages: {
    contactTitle: "اتصل بنا", contactText: "لديك سؤال حول منتج أو طلب؟ راسلنا.",
    name: "الاسم", email: "البريد الإلكتروني", message: "الرسالة", send: "إرسال", sentPreview: "معاينة: لم يتم إرسال الرسالة بعد.",
    faqTitle: "الأسئلة الشائعة",
    faq: [
      ["ما هي مدة التوصيل؟", "تختلف المدة حسب منطقتك وسيتم تحديدها عند تأكيد الطلب."],
      ["كيف أدفع ثمن طلبي؟", "يتم الدفع نقداً عند الاستلام."],
      ["هل يمكنني إرجاع منتج؟", "نعم، راجع صفحة الإرجاع لمعرفة الشروط."],
      ["هل توصلون إلى إيطاليا؟", "نعم، تخدم ARTYFAM تونس وإيطاليا بأسعار مكيفة لكل سوق."],
    ],
    shippingTitle: "التوصيل", returnsTitle: "الإرجاع والاستبدال", privacyTitle: "سياسة الخصوصية", termsTitle: "الشروط العامة للبيع",
    policyPlaceholder: "محتوى مؤقت. سيتم توفير النص الرسمي لهذه الصفحة ونشره من قبل ARTYFAM.",
  },
  notFound: { title: "الصفحة غير موجودة", text: "الصفحة المطلوبة غير موجودة.", home: "العودة إلى الرئيسية" },
};

export const translations = { fr, it, ar } as const;
