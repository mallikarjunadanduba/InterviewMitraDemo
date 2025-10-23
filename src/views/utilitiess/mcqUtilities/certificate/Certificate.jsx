import React, { useRef } from 'react';
import moment from 'moment';
import { Grid, Button, Typography } from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import styles from './certificateGenerator.module.scss';
import Medal from '../../../../assets/images/medal.jpg';

const Certificate = ({ name, course, dateOfConductStart, dateOfConductEnd, signature, signatureDetails }) => {
  const certificateRef = useRef();

  const handleDownloadPDF = () => {
    const input = certificateRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${name}-certificate.pdf`);
    });
  };

  return (
    <>
      <div ref={certificateRef} className={styles.certificateContainer}>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={12}>
            <div>Logo</div>
          </Grid>

          <Grid item xs={12}>
            <Typography sx={{ fontSize: { xs: 15, sm: 20 }, fontWeight: 600, background: 'rgb(26, 26, 100)', color: '#fff' }}>
              CERTIFICATE OF APPRECIATION
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <span className={styles.smallText}>This certificate is proudly awarded to</span>
          </Grid>

          <Grid item xs={12}>
            <Typography sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }} className={styles.primaryItalicText}>
              {name}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <span className={styles.smallText}>for successfully completing the course</span>
          </Grid>

          <Grid item xs={12}>
            <Typography sx={{ fontSize: { xs: 15, sm: 20 }, fontWeight: 600 }}>{course}</Typography>
          </Grid>

          <Grid item xs={12} className={styles.medalContainer} sx={{ m: -2 }}>
            <img className={styles.medalImage} src={Medal} alt="Gold Medal" />
          </Grid>

          <Grid item xs={12}>
            <span className={styles.smallText}>
              {`conducted from ${
                dateOfConductStart ? moment(dateOfConductStart).format('MMMM YYYY') : '-'
              } to ${dateOfConductEnd ? moment(dateOfConductEnd).format('MMMM YYYY') : '-'}`}{' '}
            </span>
          </Grid>

          <Grid item xs={12} className={styles.signatureBlock}>
            {signature.preview && <img className={styles.signatureImage} src={signature.preview} alt="Signature" />}
            <div className={styles.signatureDetailsContainer}>
              <span className={styles.horizontalBar} />
              <span className={styles.smallText}>{signatureDetails}</span>
            </div>
          </Grid>
        </Grid>
      </div>

      <Button
        sx={{
          '&:hover': {
            color: '#fff',
            background: 'rgb(26, 26, 100)'
          },
          background: 'rgb(26, 26, 100)',
          color: '#fff'
        }}
        style={{ marginTop: '3rem' }}
        onClick={handleDownloadPDF}
      >
        Download PDF
      </Button>
    </>
  );
};

export default Certificate;
