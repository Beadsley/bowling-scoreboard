import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  pinsContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  invisible: {
    visibility: 'hidden',
  },
}));

function Pins(props) {
  const [buttons, setButtons] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    props.started && handleGenerateScoreButtons();
  }, [props.score, props.currentPlayer]);

  function handleGenerateScoreButtons() {
    let pins = [];
    for (let pin = 0; pin <= 10 - props.frameScore; pin++) {
      pins.push(
        <div key={`pin-${pin}`} className={classes.root}>
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
              props.update(pin);
            }}
          >
            {pin}
          </Button>
        </div>
      );
    }
    setButtons(pins);
  }

  return (
    <>
      <h2>Click Number of Pins Knocked Down!</h2>
      <div className={props.roll === 2 ? `${classes.invisible} ${classes.pinsContainer}` : classes.pinsContainer}>
        {buttons}
      </div>
    </>
  );
}

export default Pins;
