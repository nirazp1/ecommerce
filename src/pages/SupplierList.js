import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import { getSuppliers } from '../api';

function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await getSuppliers();
        setSuppliers(response.data);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };
    fetchSuppliers();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Suppliers
      </Typography>
      <List>
        {suppliers.map((supplier) => (
          <ListItem key={supplier._id} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt={supplier.companyName} src={supplier.logo} />
            </ListItemAvatar>
            <ListItemText
              primary={supplier.companyName}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.primary">
                    {supplier.industry}
                  </Typography>
                  {` — ${supplier.description}`}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default SupplierList;
