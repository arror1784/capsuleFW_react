import React, { Component } from 'react';

class FileUploadForm extends Component {
	state = {
		name: ''
	}
	handleChange = (e) => {
		this.setState({
			name: e.target.value
		})
	}
	render() {
		return (
			<form>
				<input id="id_file" type="file" name="file"/>
				<button type="submit">upload</button>
			</form>
		);
  }
}

export default FileUploadForm;
