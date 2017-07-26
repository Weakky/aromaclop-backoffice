import React, { PropTypes } from 'react';

import './styles/button.css';

const Button = ( props ) => {
  return (
    <div className='Button-container'>
      <button
        style={{ border: 0, backgroundColor: props.color}}
        className='Button-link'
        onClick={() => props.callback()}>
        {props.icon}
          <span className="Button-link-label">
            {props.label}
          </span>
      </button>
    </div>
  )
};

Button.PropTypes = {
  color: PropTypes.string,
  callback: PropTypes.func,
  icon: PropTypes.element,
  label: PropTypes.string,
};

export default Button;