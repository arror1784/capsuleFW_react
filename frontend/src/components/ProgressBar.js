import React, { Component } from 'react';
import axios from 'axios';
import CSRFToken from '../csrftoken';
import './ProgressBar.scss';

class ProgressBar extends Component {

	state = {
	}

	componentDidMount(){
		axios.get('/api/get_csrf/')
	}



	render() {
		return (


        <div class="container">
        <CSRFToken />
            <header>
                <h1>Pure <strong>CSS</strong> Progress</h1>
                <p>... a pretty liquid progress-bar.</p>
            </header>
            <section>
                <article>
                    <input type="radio" name="switch-color" id="red" checked/>
                    <input type="radio" name="switch-color" id="cyan"/>
                    <input type="radio" name="switch-color" id="lime"/>
                    <div class="chart">
                        <div class="bar bar-20 white">
                            <div class="face top">
                                <div class="growing-bar"></div>
                            </div>
                            <div class="face side-0">
                                <div class="growing-bar"></div>
                            </div>
                            <div class="face floor">
                                <div class="growing-bar"></div>
                            </div>
                            <div class="face side-a"></div>
                            <div class="face side-b"></div>
                            <div class="face side-1">
                                <div class="growing-bar"></div>
                            </div>
                        </div>
                    </div>
                    <p>Try another color :)</p>
                    <nav class="actions">
                        <label for="red">Red</label>
                        <label for="cyan">Cyan</label>
                        <label for="lime">Lime</label>
                    </nav>
                </article>
                <article>
                    <input type="radio" name="switch-pos" id="pos-0"/>
                    <input type="radio" name="switch-pos" id="pos-1"/>
                    <input type="radio" name="switch-pos" id="pos-2" checked/>
                    <input type="radio" name="switch-pos" id="pos-3"/>
                    <div class="chart">
                        <div class="bar bar-30 white">
                            <div class="face top">
                                <div class="growing-bar"></div>
                            </div>
                            <div class="face side-0">
                                <div class="growing-bar"></div>
                            </div>
                            <div class="face floor">
                                <div class="growing-bar"></div>
                            </div>
                            <div class="face side-a"></div>
                            <div class="face side-b"></div>
                            <div class="face side-1">
                                <div class="growing-bar"></div>
                            </div>
                        </div>
                    </div>
                    <p>Try another position :)</p>
                    <nav class="actions">
                        <label for="pos-0">1/4</label>
                        <label for="pos-1">2/4</label>
                        <label for="pos-2">3/4</label>
                        <label for="pos-3">Full</label>
                    </nav>
                </article>
                <article>
                    <input type="radio" name="exercises" id="exercise-1" checked/>
                    <input type="radio" name="exercises" id="exercise-2"/>
                    <input type="radio" name="exercises" id="exercise-3"/>
                    <input type="radio" name="exercises" id="exercise-4"/>
                    <div class="chart grid">
                        <div class="exercise second">
                            <div class="bar bar-45 navy lightGray-face">
                                <div class="face top">
                                    <div class="growing-bar"></div>
                                </div>
                                <div class="face side-0">
                                    <div class="growing-bar"></div>
                                </div>
                                <div class="face floor">
                                    <div class="growing-bar"></div>
                                </div>
                                <div class="face side-a"></div>
                                <div class="face side-b"></div>
                                <div class="face side-1">
                                    <div class="growing-bar"></div>
                                </div>
                            </div>
                            <div class="bar bar-80 yellow lightGray-face">
                                <div class="face top">
                                    <div class="growing-bar"></div>
                                </div>
                                <div class="face side-0">
                                    <div class="growing-bar"></div>
                                </div>
                                <div class="face floor">
                                    <div class="growing-bar"></div>
                                </div>
                                <div class="face side-a"></div>
                                <div class="face side-b"></div>
                                <div class="face side-1">
                                    <div class="growing-bar"></div>
                                </div>
                            </div>
                            <div class="bar bar-60 red lightGray-face">
                                <div class="face top">
                                    <div class="growing-bar"></div>
                                </div>
                                <div class="face side-0">
                                    <div class="growing-bar"></div>
                                </div>
                                <div class="face floor">
                                    <div class="growing-bar"></div>
                                </div>
                                <div class="face side-a"></div>
                                <div class="face side-b"></div>
                                <div class="face side-1">
                                    <div class="growing-bar"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p><em>It's liquid</em>, so adding a bit of code you can make charts like this :P</p>
                    <nav class="actions">
                        <label for="exercise-1">E-1</label>
                        <label for="exercise-2">E-2</label>
                        <label for="exercise-3">E-3</label>
                        <label for="exercise-4">E-4</label>
                    </nav>
                </article>
            </section>
        </div>);
	}
}

export default ProgressBar;

