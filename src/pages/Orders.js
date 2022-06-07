import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
// mock
import ORDERLIST from '../_mock/order';
import axios from '../http-common';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'role', label: 'Type', alignRight: false },
  { id: 'isVerified', label: 'Category', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'inStock', label: 'In Stock', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Order() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [artikal, setArtikal] = useState({});
  const [noviArtikli, setNoviArtikli] = useState({});

  useEffect(() => {
    if (localStorage.getItem('user') === null || JSON.parse(localStorage.getItem('user')).uloga === 1) {
      navigate('/404', { replace: true });
      navigate(0);
    }

    axios.get('/artikal').then((res) => {
      setArtikal(res.data.data.artikli);
    });
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
      const newOrders = ORDERLIST.map((order, i) => {
        return {
          id: artikal[i].id,
          name: artikal[i].naziv,
          role: roles.find((r) => {
            return r.match(/\d/g).join('') === artikal[i].vrsta.toString();
          }),
          inStock: artikal[i].kolicina,
          isVerified: order.isVerified,
          status: order.status,
          narudzba: artikal[i].narudzba,
          kolicina: artikal[i].kolicina,
          snizen: artikal[i].snizen,
          brojProdanih: artikal[i].brojProdanih,
          cijena: artikal[i].cijena,
          avatarUrl: order.avatarUrl,
        };
      });
      setNoviArtikli(newOrders);
    }
  }, [setArtikal, artikal]);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = ORDERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    console.log('NEW SELECTED: ', newSelected);
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  console.log('ARTIKAL: ', artikal);
  console.log('NOVI ARTIKAL: ', noviArtikli);
  console.log('ORDER LIST: ', ORDERLIST);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - noviArtikli.length) : 0;

  let filteredUsers = applySortFilter(ORDERLIST, getComparator(order, orderBy), filterName);

  if (Object.values(noviArtikli).length > 0)
    filteredUsers = applySortFilter(noviArtikli, getComparator(order, orderBy), filterName);
  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="User">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Orders
          </Typography>
          <Button variant="contained" component={RouterLink} to="#" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Order
          </Button>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={noviArtikli.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, name, role, status, avatarUrl, isVerified, inStock } = row;
                    const isItemSelected = selected.indexOf(name) !== -1;

                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, name)} />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={name} src={avatarUrl} />
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{role.substring(3)}</TableCell>
                        <TableCell align="left">{isVerified ? "Men's" : "Women's"}</TableCell>
                        <TableCell align="left">
                          <Label
                            variant="ghost"
                            color={(status === 'Canceled' && 'error') || (status === 'Shipped' && 'info') || 'success'}
                          >
                            {sentenceCase(status)}
                          </Label>
                        </TableCell>
                        <TableCell align="left">{inStock}</TableCell>
                        <TableCell align="right">
                          <UserMoreMenu />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={ORDERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
