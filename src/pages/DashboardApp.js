import { useState, useEffect } from 'react';

import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';

import WISHLIST from '../_mock/wishlist';
import axios from '../http-common';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const theme = useTheme();

  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [artikal, setArtikal] = useState({});

  useEffect(async () => {
    if (localStorage.getItem('user') === null || JSON.parse(localStorage.getItem('user')).uloga === 1) {
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
    console.log('ARTIKAL', ordersNew);
    setUser(JSON.parse(localStorage.getItem('user')));
  }, []);
  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Weekly Sales" total={714000} icon={'ant-design:android-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="New Users" total={1352831} color="info" icon={'ant-design:apple-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Item Orders" total={1723315} color="warning" icon={'ant-design:windows-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Bug Reports" total={234} color="error" icon={'ant-design:bug-filled'} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Website Visits"
              subheader="(+43%) than last year"
              chartLabels={[
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ]}
              chartData={[
                {
                  name: 'Team A',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Team B',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Team C',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Current Visits"
              chartData={[
                { label: 'America', value: 4344 },
                { label: 'Asia', value: 5435 },
                { label: 'Europe', value: 1443 },
                { label: 'Africa', value: 4443 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.chart.blue[0],
                theme.palette.chart.violet[0],
                theme.palette.chart.yellow[0],
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title:
                  Object.values(artikal).length > 0
                    ? artikal[index].naziv
                    : [
                        '100 orders, $4220 in total',
                        'Item #A-1234 Shipped',
                        'Item #N-1234 Shipped',
                        'New order placed #XF-2356',
                        'New order placed #XF-2346',
                      ][index],
                type: `order${index + 1}`,
                time: faker.date.between('2022-06-07', '2022-0607'),
              }))}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
