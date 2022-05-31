import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// material
import { Container, Stack, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../sections/@dashboard/products';
// mock
import WISHLIST from '../_mock/wishlist';
import axios from '../http-common';

// ----------------------------------------------------------------------

export default function EcommerceShopWishlist() {
  const [openFilter, setOpenFilter] = useState(false);
  const [artikli, setArtikli] = useState();

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const navigate = useNavigate();
  const [user, setUser] = useState({});

  useEffect(async () => {
    if (localStorage.getItem('user') === null || JSON.parse(localStorage.getItem('user')).uloga === 2) {
      navigate('/404', { replace: true });
      navigate(0);
    }
    setUser(JSON.parse(localStorage.getItem('user')));

    try {
      const response = await axios.get('/artikal');
      console.log('response: ', response.data.data.artikli);
      setArtikli(response.data.data.artikli);
    } catch (err) {
      console.log(err);
    }
  }, []);

  console.log('Artikli: ', artikli);
  return (
    <Page title="Dashboard: Products">
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
            />
            <ProductSort />
          </Stack>
        </Stack>

        <ProductList products={WISHLIST} artikli={artikli} />
        <ProductCartWidget />
      </Container>
    </Page>
  );
}
