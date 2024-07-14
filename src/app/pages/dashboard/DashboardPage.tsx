import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress, Grid } from '@mui/material';
import ScriptCard from './../ScriptWriting/ScriptCard';
import { fetchScripts } from './../../modules/apps/scripts/features/scriptSlice';
import { RootState, AppDispatch } from './../../../app/modules/apps/scripts/store';

interface Script {
  _id: string; // Ensure _id is included here
  title: string;
  updatedAt: string;
  genre?: string;
  synopsis: string;
  socialMedia?: string;
  content?: string;
}

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const scripts = useSelector((state: RootState) => state.scripts.scripts);
  const loading = useSelector((state: RootState) => state.scripts.fetchingScripts);



  useEffect(() => {
    dispatch(fetchScripts());
  }, [dispatch]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Grid container spacing={3}>
      {scripts.map((script) => (
        <Grid item xs={12} sm={6} md={4} key={script._id}>
          <ScriptCard script={script} />
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardPage;
