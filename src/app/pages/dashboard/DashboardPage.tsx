import React, { useEffect, useState } from 'react';
import { CircularProgress, Grid } from '@mui/material';
import ScriptCard from './../ScriptWriting/ScriptCard';
import { fetchScripts } from './../../utils/scriptUtils';

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [scripts, setScripts] = useState<any[]>([]);

  useEffect(() => {
    fetchScripts(setLoading, setScripts);
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Grid container spacing={3}>
      {scripts.map((script) => (
        <Grid item xs={12} sm={6} md={4} key={script.id}>
          <ScriptCard script={script} />
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardPage;
