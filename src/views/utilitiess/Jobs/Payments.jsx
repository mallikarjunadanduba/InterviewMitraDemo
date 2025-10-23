// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

const paymentHistory = [
  {
    id: 1,
    title: 'Mock Interview Session',
    amount: '₹499',
    date: 'July 20, 2025',
    status: 'Paid'
  },
  {
    id: 2,
    title: 'Resume Review',
    amount: '₹299',
    date: 'July 15, 2025',
    status: 'Paid'
  },
  {
    id: 3,
    title: 'Premium Access - Monthly',
    amount: '₹999',
    date: 'July 1, 2025',
    status: 'Pending'
  }
];

const Payments = () => {
  const theme = useTheme();

  return (
    <MainCard title="Job Payments">
      <Grid container spacing={gridSpacing}>
        {paymentHistory.map((payment) => (
          <Grid item xs={12} sm={6} md={4} key={payment.id}>
            <Card
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderLeft: `6px solid ${
                  payment.status === 'Paid' ? theme.palette.success.main : theme.palette.warning.main
                }`,
                boxShadow: 1,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }}
            >
              <CardContent>
                <Typography variant="h6">{payment.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Date: {payment.date}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {payment.amount}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      bgcolor:
                        payment.status === 'Paid'
                          ? theme.palette.success.light
                          : theme.palette.warning.light,
                      color:
                        payment.status === 'Paid'
                          ? theme.palette.success.dark
                          : theme.palette.warning.dark,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '12px'
                    }}
                  >
                    {payment.status}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </MainCard>
  );
};

export default Payments;
