import { Box, Typography } from '@mui/material';

const ExamHeader = ({ currentPage, totalPages }) => {
    return (
        <Box px={3} py={2} borderBottom={1} borderColor="divider" bgcolor="white">
            <Typography variant="h6">Page No. {currentPage} <Typography component="span" variant="body2">(Total Page/s : {totalPages})</Typography></Typography>
        </Box>
    );
};

export default ExamHeader;