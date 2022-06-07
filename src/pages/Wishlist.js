import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// material
import {
  Container,
  Stack,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
// components
import Page from '../components/Page';
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../sections/@dashboard/products';
// mock
import PRODUCTS from '../_mock/products';
import ORDERLIST from '../_mock/order';
import WISHLIST from '../_mock/wishlist';
import axios from '../http-common';

// ----------------------------------------------------------------------

export default function EcommerceShop() {
  const [openFilter, setOpenFilter] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  const [artikal, setArtikal] = useState({});
  const [noviArtikli, setNoviArtikli] = useState({});

  const [wishlistProduct, setWishlistProduct] = useState('');

  const [open, setOpen] = useState(false);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  useEffect(async () => {
    if (localStorage.getItem('user') === null) {
      navigate('/404', { replace: true });
      navigate(0);
    }

    const response = await (await axios.get('/artikal')).data.data.artikli;
    const ordersNew = response.filter((res) => {
      return (
        JSON.parse(localStorage.getItem(`newOrders#${res.id}`)).narudzba?.id ===
        JSON.parse(localStorage.getItem('user')).narudzba_id
      );
    });

    setArtikal(ordersNew);
    setUser(JSON.parse(localStorage.getItem('user')));
  }, []);

  useEffect(() => {
    const roles = [
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
    ];

    if (Object.values(artikal).length > 0) {
      console.log('ARTIKLI: ', artikal);

      WISHLIST.length = artikal.length;
      const newOrders = WISHLIST.map((order, i) => {
        return {
          id: artikal[i].id,
          name: artikal[i].naziv,
          role: roles.find((r) => {
            return r.match(/\d/g).join('') === artikal[i].vrsta.toString();
          }),

          colors: order.colors,
          inStock: artikal[i].kolicina,
          status: artikal[i].snizen > 0 ? 'sale' : order.status,
          narudzba: artikal[i].narudzba,
          kolicina: artikal[i].kolicina,
          snizen: artikal[i].snizen,
          brojProdanih: artikal[i].brojProdanih,
          price: artikal[i].cijena,
          cover: order.cover,
          priceSale: artikal[i].snizen > 0 ? artikal[i].cijena * artikal[i].snizen + artikal[i].cijena : null,
          datum: artikal[i].datumDodavanja,
          gender: ORDERLIST[i].isVerified ? 'Men' : 'Women',
        };
      });

      setNoviArtikli(newOrders);
    }
  }, [setArtikal, artikal]);

  const handlePriceFilter = (event) => {
    setNoviArtikli(
      noviArtikli.filter((artikal) => {
        if (event.target.value === 'below') return artikal.price < 25;
        if (event.target.value === 'between') return artikal.price >= 25 && artikal.price <= 75;
        return artikal.price > 75;
      })
    );
  };

  const handleColorFilter = (event) => {
    setNoviArtikli(
      noviArtikli.filter((artikal) => {
        return artikal.colors.includes(event.target.value);
      })
    );
  };

  const handleSort = (event) => {
    const sortingPrice = event.target.innerHTML.split('<')[0].substring(7);

    setNoviArtikli(
      noviArtikli
        .sort((a, b) => {
          if (sortingPrice === 'High-Low') return b.price - a.price;
          return a.price - b.price;
        })
        .map((a) => a)
    );
  };

  const handleClick = (event) => {
    setWishlistProduct(noviArtikli.find((a) => a.name === event.target.innerHTML));
    setOpen(true);
  };

  return (
    <Page title="Dashboard: Wishlist">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          My Wishlist
        </Typography>

        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterSidebar
              isOpenFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
              values={Object.values(noviArtikli).length > 0 ? noviArtikli : WISHLIST}
              handlePriceFilter={handlePriceFilter}
              handleColorFilter={handleColorFilter}
            />
            <ProductSort handleSort={handleSort} />
          </Stack>
        </Stack>

        <ProductList
          products={Object.values(noviArtikli).length > 0 ? noviArtikli : WISHLIST}
          handleClick={handleClick}
        />
        <ProductCartWidget />
      </Container>
    </Page>
  );
}
