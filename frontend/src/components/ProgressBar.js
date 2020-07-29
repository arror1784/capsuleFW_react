import React, { Component } from 'react';
import axios from 'axios';
import CSRFToken from '../csrftoken';
import styles from './ProgressBar.module.scss';


//styles.bar-" + this.props.value + " 
class ProgressBar extends Component {
	render() {
        let progressVal = styles["bar-"+ this.props.value];
		return (
        <div id="container" className={styles.chart}>
            <div className={ `${styles.bar} ${progressVal} ${styles.cyan}`}>
                <div className={ `${styles.face} ${styles.top}`}>
                    <div className={styles["growing-bar"]}></div>
                </div>
                <div className={ `${styles.face} ${styles.side-0}` }>
                    <div className={styles["growing-bar"]}></div>
                </div>
                <div className={ `${styles.face} ${styles.floor}`}>
                    <div className={styles["growing-bar"]}></div>
                </div>
                <div className={ `${styles.face} ${styles["side-a"]}`}></div>
                <div className={ `${styles.face} ${styles["side-b"]}`}></div>
                <div className={ `${styles.face} ${styles["side-1"]}`}>
                    <div className={styles["growing-bar"]}></div>
                </div>
            </div>
        </div>
        );
	}
}

export default ProgressBar;

