import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  useMediaQuery,
  useTheme,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Divider
} from '@mui/material';
import { IconCreditCard, IconCalendar, IconCurrencyRupee, IconCircleCheck, IconCircleX, IconClock } from '@tabler/icons-react';
import MainCard from 'ui-component/cards/MainCard';
import { getOrdersByJobSeeker } from 'views/API/MyCourseApi';

const Payments = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const user = JSON.parse(sessionStorage.getItem('user'));
  const headers = {
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + user.accessToken
  };

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all course orders for the current user
      const ordersResponse = await getOrdersByJobSeeker(headers, user.seekerId);
      const fetchedOrders = ordersResponse.data;

      // Sort orders by creation date (newest first)
      const sortedOrders = fetchedOrders.sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );

      setOrders(sortedOrders);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      setError('Failed to load payment history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.seekerId) {
      fetchPaymentHistory();
    } else {
      setError('User not found. Please login again.');
      setLoading(false);
    }
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'SUCCESS':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'FAILED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'SUCCESS':
        return <IconCircleCheck size={16} />;
      case 'FAILED':
        return <IconCircleX size={16} />;
      default:
        return <IconCreditCard size={16} />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalAmount = () => {
    return orders
      .filter(order => order.paymentStatus === 'SUCCESS')
      .reduce((total, order) => total + order.amountPaid, 0);
  };

  const getSuccessfulOrdersCount = () => {
    return orders.filter(order => order.paymentStatus === 'SUCCESS').length;
  };

  const getPendingOrdersCount = () => {
    return orders.filter(order => order.paymentStatus === 'PENDING').length;
  };

  if (loading) {
    return (
      <MainCard>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Loading payment history...
          </Typography>
        </Box>
      </MainCard>
    );
  }

  if (error) {
    return (
      <MainCard>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchPaymentHistory}>
          Retry
        </Button>
      </MainCard>
    );
  }

  return (
    <>
      <MainCard>
        <Typography variant="h3" gutterBottom sx={{ mb: 3 }}>
          Payment History
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {/* Summary Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderLeft: `6px solid ${theme.palette.success.main}`,
                boxShadow: 1,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <IconCircleCheck size={24} color={theme.palette.success.main} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.success.main }}>
                      {getSuccessfulOrdersCount()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Successful Payments
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderLeft: `6px solid ${theme.palette.warning.main}`,
                boxShadow: 1,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <IconCurrencyRupee size={24} color={theme.palette.warning.main} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.warning.main }}>
                      ₹{getTotalAmount()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Spent
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderLeft: `6px solid ${theme.palette.primary.main}`,
                boxShadow: 1,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <IconCreditCard size={24} color={theme.palette.primary.main} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                      {orders.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Transactions
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderLeft: `6px solid ${theme.palette.info.main}`,
                boxShadow: 1,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <IconClock size={24} color={theme.palette.info.main} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.info.main }}>
                      {getPendingOrdersCount()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending Payments
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Payment History Table */}
        <MainCard>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Transaction History
          </Typography>

          {orders.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Typography variant="h6" gutterBottom>
                No payment history found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Your payment transactions will appear here once you make a purchase.
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><strong>Course</strong></TableCell>
                    <TableCell><strong>Amount</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Payment Gateway</strong></TableCell>
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell><strong>Transaction ID</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.orderId} hover>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {order.course?.courseName || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <IconCurrencyRupee size={16} />
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {order.amountPaid}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(order.paymentStatus)}
                          label={order.paymentStatus}
                          color={getStatusColor(order.paymentStatus)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {order.paymentGateway || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <IconCalendar size={16} />
                          <Typography variant="body2">
                            {formatDate(order.createdAt)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                          {order.transactionId || 'N/A'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </MainCard>
      </MainCard>
    </>
  );
};

export default Payments;