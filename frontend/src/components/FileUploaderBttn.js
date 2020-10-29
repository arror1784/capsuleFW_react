import React from 'react';
import styled from 'styled-components';
// Style the Button component
const Button = styled.button`
  /* Insert your favorite CSS code to style a button */
`;
const FileUploaderBttn = props => {
  // Create a reference to the hidden file input element
  const hiddenFileInput = React.useRef(null);
  
  // Programatically click the hidden file input element when the Button component is clicked
  const handleClick = event => {
    hiddenFileInput.current.click();
  };
  // Call a function (passed as a prop from the parent component) to handle the user-selected file 
  const handleChange = event => {
    props.handleFile(event);
  };
  return (
    <>
      <Button onClick={handleClick}>
        Choose a file (.zip)
      </Button>
      <input
        type="file"
        ref={hiddenFileInput}
        accept=".zip"
        onChange={handleChange}
        style={{display: 'none'}} /* Make the file input element invisible */
      />
    </>
  );
}
export default FileUploaderBttn;
