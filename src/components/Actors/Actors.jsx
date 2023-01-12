import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Box, Button, CircularProgress, Typography, Grid } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

import useStyles from './styles';
import { useGetActorQuery, useGetMoviesByActorIdQuery } from '../../services/TMDB';
import { MovieList, Pagination } from '..';

const Actors = () => {
  const classes = useStyles();
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { data, isFetching, error } = useGetActorQuery({ id });
  const { data: movies } = useGetMoviesByActorIdQuery({ id, page });

  if (isFetching) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center'>
        <CircularProgress size='8rem' />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center'>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} color='primary'>
          Go Back.
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item lg={5} xl={4} sx={{ display: 'flex', justifyContent: 'center' }}>
          <img
            className={classes.image}
            src={`https://image.tmdb.org/t/p/w780/${data?.profile_path}`}
            alt={data?.name}
          />
        </Grid>
        <Grid
          item
          container
          lg={7}
          xl={8}
          style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}
        >
          <Typography variant='h2' align='center' gutterBottom>
            {data?.name}
          </Typography>
          <Typography variant='h5' align='center' gutterBottom>
            Born: {new Date(data?.birthday).toDateString()}
          </Typography>
          <Typography variant='body1' align='center' paragraph>
            {data?.biography || 'This actor has no biography, yet :)'}
          </Typography>
          <Box marginTop='2rem' display='flex' justifyContent='space-around'>
            <Button
              variant='contained'
              color='primary'
              target='_blank'
              href={`https://www.imdb.com/name/${data?.imdb_id}`}
            >
              imdb
            </Button>
            <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} color='primary'>
              back
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Box margin='2rem 0'>
        <Typography variant='h2' align='center' gutterBottom>
          Movies
        </Typography>
        {movies && <MovieList movies={movies} numOfMovies={12} />}
        <Pagination currentPage={page} setPage={setPage} totalPages={movies?.total_pages} />
      </Box>
    </>
  );
};

export default Actors;
