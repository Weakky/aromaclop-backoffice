import React from 'react';

class Product extends React.Component {

  render () {
    return (
      <div className='pa3 bg-black-05 ma3'>
        <div className='pt3'>
          ID: {this.props.product.id}<br />
          Name: {this.props.product.name}<br />
          <span className='red f6 pointer dim' onClick={this.handleDelete}>Delete</span>
        </div>
      </div>
    )
  }

  handleDelete = () => {
    this.props.refresh()
  }
}

export default Product