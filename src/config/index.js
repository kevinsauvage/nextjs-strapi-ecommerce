const env = process.env.NODE_ENV;

const config = {
  baseUrl: 'https://localhost:3000',
  homeBanner: {
    upTitle: '',
    title: 'New In Jewelry',
    subtitle:
      'New jewelry collection includes rings, earrings, necklaces, bracelets, pendants, brooches, watches, charms, etc.',
    buttonText: 'SEE COLLECTION',
    imageUrl:
      'https://res.cloudinary.com/kevincloudname/image/upload/v1664101246/ecom/banner_home_epcxdo.jpg',
    link: '/collection/jewelry',
  },
};

if (env === 'production') {
  config.baseUrl = 'http://site_url.com';
}

export default config;
