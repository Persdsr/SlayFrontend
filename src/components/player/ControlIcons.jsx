import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import { IconButton } from '@mui/material';
import { PlayArrowSharp } from '@mui/icons-material';
import { PauseSharp } from '@mui/icons-material';
import { VolumeUp } from '@mui/icons-material';
import { VolumeOff } from '@mui/icons-material';
import { Fullscreen } from '@mui/icons-material';
import Tooltip from '@mui/material/Tooltip';

const ControlIcons = ({
  title,
  topTitle,
  playandpause,
  playing,
  rewind,
  fastForward,
  muting,
  muted,
  volumeChange,
  volumeSeek,
  volume,
  playRate,
  playerbackRate,
  fullScreenMode,
  onSeek,
  played,
  onSeekMouseUp,
  onSeekMouseDown,
  fullMovieTime,
  playedTime,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handlePopOver = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'playbackrate-popover' : undefined;

  function ValueLabelComponent(props) {
    const { children, value } = props;

    return (
      <Tooltip enterTouchDelay={0} placement="top" title={value}>
        {children}
      </Tooltip>
    );
  }

  return (
    <div className="controls__div">
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="start"
        style={{ padding: 16 }}
      >
        <Grid item>
          <Typography variant="h5" style={{ color: 'white' }}>
            {topTitle}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h5" style={{ color: 'white' }}>
            {}
          </Typography>
        </Grid>
      </Grid>

      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="center"
      >
        <IconButton
          className="controls__icons"
          aria-label="reqind"
          onClick={playandpause}
        >
          {playing ? (
            <PauseSharp fontSize="large" style={{ color: 'white' }} />
          ) : (
            <PlayArrowSharp fontSize="large" style={{ color: 'white' }} />
          )}
        </IconButton>
      </Grid>

      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        style={{ padding: 16 }}
      >
        {/*   <Grid item>
                    <Typography variant='h5' style={{color:'white'}}>Tears Of Steel</Typography>
                </Grid>*/}

        <Grid item xs={12}>
          <Slider
            min={0}
            max={100}
            value={played * 100}
            onChange={onSeek}
            onChangeCommitted={onSeekMouseUp}
            sx={{
              color: '#23c483',
              '& .MuiSlider-thumb': {
                backgroundColor: '#fff',
              },
              '& .MuiSlider-track': {
                backgroundColor: '#23c483',
              },
              '& .MuiSlider-rail': {
                backgroundColor: '#888',
              },
            }}
          />

          <Grid container direction="row" justifyContent="space-between">
            <Typography variant="h7" style={{ color: 'white' }}>
              {playedTime}
            </Typography>
            <Typography variant="h7" style={{ color: 'white' }}>
              {fullMovieTime}
            </Typography>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container alignItems="center" direction="row">
            <IconButton
              className="controls__icons"
              aria-label="reqind"
              onClick={playandpause}
            >
              {playing ? (
                <PauseSharp fontSize="large" style={{ color: 'white' }} />
              ) : (
                <PlayArrowSharp fontSize="large" style={{ color: 'white' }} />
              )}
            </IconButton>

            <IconButton
              className="controls__icons"
              aria-label="reqind"
              onClick={muting}
            >
              {muted ? (
                <VolumeOff fontSize="large" style={{ color: 'white' }} />
              ) : (
                <VolumeUp fontSize="large" style={{ color: 'white' }} />
              )}
            </IconButton>

            <Typography style={{ color: '#fff', paddingTop: '5px' }}>
              {Math.round(volume * 100)}
            </Typography>

            <Slider
              min={0}
              max={100}
              value={Math.round(volume * 100)}
              onChange={volumeChange}
              onChangeCommitted={volumeSeek}
              className="volume__slider"
              sx={{
                color: '#23c483',
                '& .MuiSlider-thumb': {
                  backgroundColor: '#fff',
                },
                '& .MuiSlider-track': {
                  backgroundColor: '#23c483',
                },
                '& .MuiSlider-rail': {
                  backgroundColor: '#888',
                },
              }}
            />
          </Grid>
        </Grid>

        <Grid item>
          <IconButton className="bottom__icons" onClick={fullScreenMode}>
            <Fullscreen fontSize="large" />
          </IconButton>
        </Grid>
      </Grid>
    </div>
  );
};
export default ControlIcons;
