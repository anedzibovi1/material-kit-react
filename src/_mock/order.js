import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const orders = [...Array(20)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: `/static/mock-images/products/product_${index + 1}.jpg`,
  name: sample([
    'Nike Solo Swoosh',
    'Sportswear Tesh Fleece',
    'Miami Heat City Edition',
    'Jordan Dri-FIT Sport BC',
    'Jordan Flight Heritage',
    'Nike SB',
    'Pique Skirt and Polo Set',
    'Sportswear Essential',
    'Yoga Dri-FIT Advance',
    'Off-White cycling shorts',
    'Palm Angels mock neck training top',
    'Stan smith sneakers',
    'Adicolor Classics Tights',
    'Puremotion Adapt Shoes',
    'Primeblue SST Track Jacket',
    'Own the Run Long Sleeve Tee',
    'Always Original Loose graphic Tee',
    'Crop Tee',
    'Tiro Track Jacket',
    'Nike x Hello Kitty',
    'Nike sportswear top',
    'Nike Prop 365 Mid-Rise Crop Leggings',
    'Nike Zoom Alphafly Next Nature',
    "Nike Air Force 1 '07",
    'Nike Dunk Low',
  ]),
  isVerified: faker.datatype.boolean(),
  inStock: faker.commerce.price(100, 200, 0),
  status: sample(['Shipped', 'Canceled', 'Bought', 'Arrived']),
  role: sample([
    '1. Sneakers',
    '2. Hoodies',
    '3. Leggings',
    '4. Shorts',
    '5. Tracksuits',
    '6. T-shirts',
    '7. Socks',
    '8. Sports Bras',
    '9. Yoga sets',
    '10. Gym clothes',
    '11. Swimwear',
  ]),
}));

export default orders;
