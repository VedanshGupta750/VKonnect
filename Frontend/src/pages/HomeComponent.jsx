import React from 'react';
import withAuth from '../utils/Auth';

function HomeComponent() {
  return (
    <div>HomeComponent</div>
  )
}

export default withAuth(HomeComponent);