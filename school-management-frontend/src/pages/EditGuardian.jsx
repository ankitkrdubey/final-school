import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AddGuardian from './AddGuardian';

const EditGuardian = () => {
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      localStorage.setItem('lastViewedGuardianId', id);
    }
  }, [id]);

  return <AddGuardian mode="edit" />;
};

export default EditGuardian;
