import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Grid, Card, CardContent, CardMedia, Button, Box, 
  CircularProgress, TextField, InputAdornment, Avatar, Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import { getSuppliers } from '../api';

function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await getSuppliers();
        setSuppliers(response.data);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Our Suppliers
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search suppliers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 4 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <Grid container spacing={4}>
        {filteredSuppliers.map((supplier) => (
          <Grid item key={supplier._id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={supplier.coverImage || 'https://via.placeholder.com/400x140'}
                  alt={supplier.companyName}
                />
                <Avatar
                  src={supplier.logo}
                  sx={{
                    width: 80,
                    height: 80,
                    border: '4px solid white',
                    position: 'absolute',
                    bottom: -40,
                    left: 20,
                  }}
                />
              </Box>
              <CardContent sx={{ flexGrow: 1, pt: 5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography gutterBottom variant="h5" component="div">
                    {supplier.companyName}
                  </Typography>
                  {supplier.verified && <VerifiedIcon color="primary" />}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {supplier.description}
                </Typography>
                <Chip 
                  icon={<LocationOnIcon />} 
                  label={`${supplier.location.city}, ${supplier.location.country}`} 
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Industry: {supplier.industry}
                </Typography>
              </CardContent>
              <Button variant="contained" color="primary" fullWidth>
                Contact Supplier
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default SupplierList;
