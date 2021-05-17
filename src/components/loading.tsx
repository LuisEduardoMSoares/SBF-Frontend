import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { createStyles, makeStyles } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles(() => (createStyles({
    root: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        background: 'rgba(255, 255, 255, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
})))

export default function Loading() {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            <FontAwesomeIcon className="fa-spin" icon={faSpinner} color="primary" size="2x" />
        </div>
    )
}