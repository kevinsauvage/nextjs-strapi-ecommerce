import type { Locale } from '@/i18n/routing';

/**
 * Page metadata (browser title, meta description, OG tags) and the legal /
 * search banner copy, per locale.
 *
 * English is the source of truth — `es` and `fr` are typed as `Seo`, so a
 * missing section fails `tsc`. Pages resolve it with `getSeo(locale)`; routes
 * without params (loading skeletons, the wishlist page) use the default
 * language, exactly like `Breadcrumbs` does for its root crumb.
 */
const en = {
  account: {
    addresses: {
      description:
        'The customer addresses page displays a list of saved addresses for quick and easy access. Add, edit, or delete addresses as needed.',
      title: 'My addresses',
    },
    description:
      'On the user account page, manage your personal information, update your password and view your account activity all in one place.',

    orders: {
      description:
        'The orders page is where you can view your purchase history, track current orders, and manage returns or cancellations. Stay up-to-date on your orders',
      title: 'My orders',
    },

    title: 'My account',

    update: {
      description:
        'Update your user information quickly and easily with our user info update form page. Change your name, email, phone number, and more in just a few clicks.',
      title: 'My details',
    },
  },
  cart: {
    description:
      'Browse and manage items in your cart with ease. Our cart page makes it simple to view and adjust your order before checkout. Start shopping now.',
    title: 'Cart',
  },
  home: {
    description:
      'Thoughtfully selected pet essentials for modern dogs and cats — beds, carriers, feeders and toys made in Europe. Free EU shipping over €80.',
    title: 'Premium Pet Products for Dogs & Cats',
  },
  pages: {
    contact: {
      description:
        'Get in touch with us through our contact page. Our team is here to help answer your questions, provide assistance, or listen to your feedback. Contact us now.',
      title: 'Contact',
    },
    privacy: {
      description:
        "Protecting your privacy is our top priority. Our privacy page outlines how we collect and use your personal information to ensure it's safe and secure. Read more now.",
      title: 'Privacy',
    },
    refund: {
      description:
        'We want you to be completely satisfied with your purchase. Our refund policy page outlines our policies and procedures for returns, exchanges, and refunds. Read more now.',
      title: 'Refund',
    },
    shipping: {
      description:
        'Our shipping policy page provides information about our shipping methods, delivery times, and fees. Find out how we ship our products to ensure you receive them on time. Read more now.',
      title: 'Shipping',
    },
    subscription: {
      description:
        'Our subscription policy page explains how subscriptions, renewals, and cancellations work. Read the terms before subscribing.',
      title: 'Subscription Policy',
    },
    terms: {
      description:
        'Our terms and conditions page outlines the legal agreement between you and our company when using our website. It includes important information about the use of our website, payment, shipping, and more. Read more now.',
      title: 'Terms and Conditions',
    },
  },
  search: {
    description:
      "Looking for something specific? Our search page makes it easy to find what you're looking for. Enter your search terms and browse through relevant results quickly. Start searching now.",
    title: 'Search',
  },
  wishlist: {
    description:
      'Create a wishlist of your favorite items for future purchases. Our wishlist page makes it easy to save and track items you love. Start building your wishlist now.',
    title: 'Wishlist',
  },
} as const;

type Widen<T> = T extends string ? string : { [K in keyof T]: Widen<T[K]> };

export type Seo = Widen<typeof en>;

const es: Seo = {
  account: {
    addresses: {
      description:
        'La página de direcciones muestra tu lista guardada para acceder rápido y fácil. Añade, edita o elimina direcciones cuando lo necesites.',
      title: 'Mis direcciones',
    },
    description:
      'En tu página de cuenta, gestiona tu información personal, actualiza tu contraseña y consulta tu actividad en un mismo lugar.',
    orders: {
      description:
        'La página de pedidos muestra tu historial de compras, el seguimiento de pedidos actuales y la gestión de devoluciones o cancelaciones. Mantente al día de tus pedidos.',
      title: 'Mis pedidos',
    },
    title: 'Mi cuenta',
    update: {
      description:
        'Actualiza tu información de usuario de forma rápida y sencilla con nuestro formulario. Cambia tu nombre, correo, teléfono y más en unos clics.',
      title: 'Mis datos',
    },
  },
  cart: {
    description:
      'Consulta y gestiona los artículos de tu carrito con facilidad. Nuestra página del carrito simplifica revisar y ajustar tu pedido antes de finalizar la compra. Empieza a comprar ahora.',
    title: 'Carrito',
  },
  home: {
    description:
      'Esenciales para mascotas seleccionados con cuidado para perros y gatos modernos: camas, transportines, comederos y juguetes fabricados en Europa. Envío gratis en la UE desde 80 €.',
    title: 'Productos premium para perros y gatos',
  },
  pages: {
    contact: {
      description:
        'Ponte en contacto con nosotros a través de nuestra página de contacto. Nuestro equipo está aquí para responder tus preguntas, ayudarte o escuchar tus comentarios. Contáctanos ahora.',
      title: 'Contacto',
    },
    privacy: {
      description:
        'Proteger tu privacidad es nuestra máxima prioridad. Nuestra página de privacidad explica cómo recogemos y usamos tu información personal para mantenerla segura. Más información.',
      title: 'Privacidad',
    },
    refund: {
      description:
        'Queremos que estés totalmente satisfecho con tu compra. Nuestra página de devoluciones explica nuestras políticas y procedimientos de devoluciones, cambios y reembolsos. Más información.',
      title: 'Devoluciones',
    },
    shipping: {
      description:
        'Nuestra página de envíos informa sobre métodos de envío, plazos y tarifas. Descubre cómo enviamos tus productos para que los recibas a tiempo. Más información.',
      title: 'Envíos',
    },
    subscription: {
      description:
        'Nuestra página de suscripción explica cómo funcionan las suscripciones, renovaciones y cancelaciones. Lee las condiciones antes de suscribirte.',
      title: 'Política de suscripción',
    },
    terms: {
      description:
        'Nuestra página de términos detalla el acuerdo legal entre tú y nuestra empresa al usar nuestro sitio. Incluye información importante sobre el uso del sitio, pagos, envíos y más. Más información.',
      title: 'Términos y condiciones',
    },
  },
  search: {
    description:
      '¿Buscas algo concreto? Nuestra página de búsqueda facilita encontrar lo que buscas. Introduce tus términos y explora resultados relevantes rápidamente. Empieza a buscar ahora.',
    title: 'Buscar',
  },
  wishlist: {
    description:
      'Crea una lista con tus artículos favoritos para futuras compras. Nuestra página de favoritos facilita guardar y seguir lo que te gusta. Empieza a crear tu lista ahora.',
    title: 'Favoritos',
  },
};

const fr: Seo = {
  account: {
    addresses: {
      description:
        'La page d’adresses affiche vos adresses enregistrées pour un accès rapide et simple. Ajoutez, modifiez ou supprimez des adresses au besoin.',
      title: 'Mes adresses',
    },
    description:
      'Sur votre page de compte, gérez vos informations personnelles, modifiez votre mot de passe et suivez votre activité au même endroit.',
    orders: {
      description:
        'La page des commandes permet de voir votre historique d’achats, de suivre vos commandes en cours et de gérer retours ou annulations. Restez informé de vos commandes.',
      title: 'Mes commandes',
    },
    title: 'Mon compte',
    update: {
      description:
        'Mettez à jour vos informations rapidement et facilement grâce à notre formulaire. Changez votre nom, votre e-mail, votre téléphone et bien plus en quelques clics.',
      title: 'Mes informations',
    },
  },
  cart: {
    description:
      'Consultez et gérez les articles de votre panier en toute simplicité. Notre page panier facilite la révision et l’ajustement de votre commande avant le paiement. Commencez vos achats.',
    title: 'Panier',
  },
  home: {
    description:
      'Des essentiels pour animaux sélectionnés avec soin pour chiens et chats modernes — lits, sacs de transport, gamelles et jouets fabriqués en Europe. Livraison offerte dans l’UE dès 80 €.',
    title: 'Produits premium pour chiens et chats',
  },
  pages: {
    contact: {
      description:
        'Contactez-nous via notre page de contact. Notre équipe est là pour répondre à vos questions, vous aider ou écouter vos retours. Contactez-nous.',
      title: 'Contact',
    },
    privacy: {
      description:
        'Protéger votre vie privée est notre priorité absolue. Notre page de confidentialité explique comment nous collectons et utilisons vos informations personnelles pour les garder en sécurité. En savoir plus.',
      title: 'Confidentialité',
    },
    refund: {
      description:
        'Nous voulons que vous soyez entièrement satisfait de votre achat. Notre page de remboursement détaille nos politiques et procédures de retours, échanges et remboursements. En savoir plus.',
      title: 'Remboursements',
    },
    shipping: {
      description:
        'Notre page de livraison informe sur nos modes d’expédition, délais et frais. Découvrez comment nous expédions vos produits pour une réception dans les temps. En savoir plus.',
      title: 'Livraison',
    },
    subscription: {
      description:
        'Notre page d’abonnement explique le fonctionnement des abonnements, renouvellements et annulations. Lisez les conditions avant de vous abonner.',
      title: 'Politique d’abonnement',
    },
    terms: {
      description:
        'Notre page de conditions détaille l’accord juridique entre vous et notre société lors de l’utilisation de notre site. Elle contient des informations importantes sur l’utilisation du site, le paiement, la livraison et plus. En savoir plus.',
      title: 'Conditions générales',
    },
  },
  search: {
    description:
      'Vous cherchez quelque chose de précis ? Notre page de recherche facilite la découverte. Saisissez vos mots-clés et parcourez rapidement des résultats pertinents. Commencez votre recherche.',
    title: 'Rechercher',
  },
  wishlist: {
    description:
      'Créez une liste de vos articles préférés pour vos futurs achats. Notre page de favoris facilite l’enregistrement et le suivi de vos coups de cœur. Commencez votre liste.',
    title: 'Favoris',
  },
};

/**
 * Metadata and banner copy for a locale, falling back to English.
 * Framework-free so server components, route handlers and tests share it.
 */
export const getSeo = (locale: Locale): Seo => {
  switch (locale) {
    case 'es':
      return es;
    case 'fr':
      return fr;
    default:
      return en;
  }
};
