import React from 'react';
import { Grid, Card, CardContent, Typography, Link, Box } from '@mui/material';
import trainingImg from '../../../assets/images/service/consultation.jpg';
import consultationImg from '../../../assets/images/service/placement.jpg';
import placementImg from '../../../assets/images/service/research and development.jpg';
import rndImg from '../../../assets/images/service/training.jpg';
import outsourcingImg from '../../../assets/images/service/training.jpg';

const Services = () => {
  const services = [
    {
      id: 1,
      title: 'TRAINING',
      image: trainingImg,
      points: ['In-house Training', 'Corporate Training', 'Institute/College Training'],
    },
    {
      id: 2,
      title: 'CONSULTATION',
      image: consultationImg,
      points: ['Individuals Consultation', 'Organization Consultation'],
    },
    {
      id: 3,
      title: 'PLACEMENT',
      image: placementImg,
      points: ['Individuals Placement', 'Bulk Placement'],
    },
    {
      id: 4,
      title: 'R&D',
      image: rndImg,
      points: ['Prototype Innovation', 'Internship Program'],
    },
    {
      id: 5,
      title: 'OUTSOURCING',
      image: outsourcingImg,
      points: ['Project Outsourcing', 'Staffs/Resource Outsourcing'],
    },
  ];

  return (
    <Box style={{ backgroundColor: '#ffffff', padding: '40px' }}>
      <Typography variant="h5" style={{ fontWeight: 'bold', color: '#2a9d8f', marginBottom: '20px' }}>
        SERVICES <span style={{ borderBottom: '3px solid #2a9d8f', width: '50px', display: 'inline-block' }}></span>
      </Typography>
      <Grid container spacing={3}>
        {services.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service.id}>
            <Card style={{ padding: '20px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
              <CardContent style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Typography variant="h6" style={{ fontWeight: 'bold' }}>{service.title}</Typography>
                  <ul style={{ paddingLeft: '20px' }}>
                    {service.points.map((point, index) => (
                      <li key={index} style={{ fontSize: '14px', color: '#333' }}>{point}</li>
                    ))}
                  </ul>
                  <Link href="#" style={{ textDecoration: 'none', color: '#2a9d8f', fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                    More &nbsp;
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
                    </svg>
                  </Link>
                </div>
                <img src={service.image} alt={service.title} style={{ width: '60px', height: '60px' }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Services;
