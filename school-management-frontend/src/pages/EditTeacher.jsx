import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AddTeacher from './AddTeacher';

const EditTeacher = () => {
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      localStorage.setItem('lastViewedTeacherId', id);
    }
  }, [id]);

  return <AddTeacher mode="edit" />;
};

export default EditTeacher;
