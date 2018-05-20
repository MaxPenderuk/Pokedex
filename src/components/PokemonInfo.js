import React from 'react';

export default class PokemonInfo extends React.Component {
  handleOnClose = e => {
    e.preventDefault();

    this.props.onClose(true);
  }

  render() {
    const { selected } = this.props;

    return <div id='info' className='col-sm-3'>
      <span id='btn-close' className='col-sm-12 col-xs-12' onClick={ this.handleOnClose }>
        <button className='close' aria-label='Close'><span aria-hidden='true'>&times;</span></button>
      </span>
      <div className='thumbnail'>
        <div id='poki-img' className='text-center'>
          <a href='#'>
            <img src={ selected.img }
            />
          </a>
        </div>
        <div className='caption'>
          <h4 className='text-center'>
            { selected.name }
          </h4>
          <table id='custom-t' className='table table-bordered'>
            <tbody>
            {
              selected.types.map((type, index) => (
                <tr key={index}>
                  <td>{ (selected.types.length > 1) ? `Type${index + 1}` : 'Type' }</td>
                  <td>{type.name.charAt(0).toUpperCase() + type.name.slice(1)}</td>
                </tr>
              ))
            }
            {
              selected.stats.map((item, index) => {
                const id = selected.types.length + index;

                return (
                  <tr key={id}>
                    <td>{item.stat.name.charAt(0).toUpperCase() + item.stat.name.slice(1)}</td>
                    <td>{item.base_stat}</td>
                  </tr>
                );
              })
            }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  }
};
