import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, TextField, Button, Box, Paper, Grid, CircularProgress } from '@mui/material';
import { getProfile, updateProfile, submitKYC } from '../api';
import { AuthContext } from '../contexts/AuthContext';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profile.profile);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  const handleKYCSubmit = async () => {
    try {
      await submitKYC();
      alert('KYC submitted successfully');
      fetchProfile();
    } catch (error) {
      console.error('Error submitting KYC:', error);
      setError('Failed to submit KYC. Please try again.');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
        <Button onClick={fetchProfile} variant="contained" sx={{ mt: 2 }}>
          Retry
        </Button>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography>No profile data available.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>Your Profile</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={profile.profile.fullName || ''}
                onChange={(e) => setProfile({...profile, profile: {...profile.profile, fullName: e.target.value}})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Name"
                value={profile.profile.companyName || ''}
                onChange={(e) => setProfile({...profile, profile: {...profile.profile, companyName: e.target.value}})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={profile.profile.address || ''}
                onChange={(e) => setProfile({...profile, profile: {...profile.profile, address: e.target.value}})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                value={profile.profile.phoneNumber || ''}
                onChange={(e) => setProfile({...profile, profile: {...profile.profile, phoneNumber: e.target.value}})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={profile.profile.description || ''}
                onChange={(e) => setProfile({...profile, profile: {...profile.profile, description: e.target.value}})}
              />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
            Update Profile
          </Button>
        </Box>
        {!profile.kycVerified && (
          <Button onClick={handleKYCSubmit} variant="contained" color="secondary" sx={{ mt: 3, ml: 2 }}>
            Submit KYC
          </Button>
        )}
        {profile.kycVerified && (
          <Typography color="success.main" sx={{ mt: 2 }}>KYC Verified</Typography>
        )}
      </Paper>
    </Container>
  );
}

export default Profile;
