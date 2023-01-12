import { useState, useEffect, useContext } from 'react';
import { AppBar, IconButton, Toolbar, Drawer, Button, Avatar, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Menu, AccountCircle, Brightness4, Brightness7 } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import useStyles from './styles';
import { ColorModeContext } from '../../utils/ToggleColorMode';
import { Sidebar, Search } from '..';
import { setUser, userSelector } from '../../features/auth';
import { fetchToken, createSessionId, movieApi } from '../../utils';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch();
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:600px)');

  const colorMode = useContext(ColorModeContext);

  const { isAuthenticated, user } = useSelector(userSelector);

  const token = localStorage.getItem('request_token');
  const sessionIdFromLS = localStorage.getItem('session_id');

  useEffect(() => {
    const loginUser = async () => {
      if (token) {
        if (sessionIdFromLS) {
          const { data: userData } = await movieApi.get(`/account?session_id=${sessionIdFromLS}`);

          dispatch(setUser(userData));
        } else {
          const sessionId = await createSessionId();
          const { data: userData } = await movieApi.get(`/account?session_id=${sessionId}`);

          dispatch(setUser(userData));
        }
      }
    };

    loginUser();
  }, [token]);

  return (
    <>
      <AppBar position='fixed'>
        <Toolbar className={classes.toolbar}>
          {isMobile && (
            <IconButton
              color='inherit'
              edge='start'
              style={{ outline: 'none' }}
              onClick={() => setMobileOpen((prevMobileOpen) => !prevMobileOpen)}
              className={classes.menuButton}
            >
              <Menu />
            </IconButton>
          )}
          <IconButton color='inherit' sx={{ ml: 1 }} onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          {!isMobile && <Search />}
          <div>
            {!isAuthenticated ? (
              <Button color='inherit' onClick={fetchToken}>
                Login &nbsp; <AccountCircle />{' '}
              </Button>
            ) : (
              <Button
                color='inherit'
                component={Link}
                to={`/profile/${user.id}`}
                className={classes.linkButton}
                onClick={() => {}}
              >
                {!isMobile && <>My Movies &nbsp; </>}
                <Avatar
                  style={{ width: 40, height: '30px' }}
                  alt='Profile'
                  src={'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png'}
                />
              </Button>
            )}
          </div>
          {isMobile && <Search />}
        </Toolbar>
      </AppBar>
      <div>
        <nav className={classes.drawer}>
          {isMobile ? (
            <Drawer
              variant='temporary'
              anchor='right'
              open={mobileOpen}
              onClose={() => setMobileOpen((prevMobileOpen) => !prevMobileOpen)}
              classes={{ paper: classes.drawerPaper }}
              ModalProps={{ keepMounted: true }}
            >
              <Sidebar setMobileOpen={setMobileOpen} />
            </Drawer>
          ) : (
            <Drawer classes={{ paper: classes.drawerPaper }} variant='permanent' open>
              <Sidebar setMobileOpen={setMobileOpen} />
            </Drawer>
          )}
        </nav>
      </div>
    </>
  );
};

export default Navbar;
