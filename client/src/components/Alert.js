import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import { IconButton, Collapse } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { scryRenderedDOMComponentsWithTag } from 'react-dom/test-utils';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

function AlertMessage(props) {
  const classes = useStyles();
  const { open, closeAlert, message } = props;

  return (
    <div className={classes.root}>
      <Collapse in={open}>
        <Alert
          severity='error'
          action={
            <IconButton aria-label='close' color='inherit' size='small' onClick={closeAlert}>
              <CloseIcon fontSize='inherit' />
            </IconButton>
          }
        >
          {message}
        </Alert>
      </Collapse>
    </div>
  );
}

export default AlertMessage;
