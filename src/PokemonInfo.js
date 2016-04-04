import React from 'react';

class PokemonInfo extends React.Component {

  handleOnClose(e) {
    e.preventDefault();
    this.props.onClose(true);
  }

  render() {
    const { selected } = this.props;
    return <div id="info" className="col-sm-3" style={{ top: "15.5%", position: "fixed", right: "6%", bottom: "10%" }}>
      <span className="col-sm-12 col-xs-12" style={{marginTop: "6px"}} onClick={ this.handleOnClose.bind(this) }>
        <button className="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
      </span>
      <div className="thumbnail">
        <div className="text-center" style={{ height: "120px" }}>
          <a href="#">
            <img src={ selected.img }
            />
          </a>
        </div>
        <div className="caption">
          <h4 className="text-center">
            { selected.name }
          </h4>
          <table className="table table-bordered" style={{fontSize: "10px"}}>
            <tbody>
            {
              selected.types.map((type, index) => (
                <tr key={index}>
                  <td>{ (selected.types.length > 1) ? "Type" + (index + 1) : "Type" }</td>
                  <td>{type.name.charAt(0).toUpperCase() + type.name.slice(1)}</td>
                </tr>
              ))
            }
            <tr>
              <td>Attack</td>
              <td>{ selected.attack }</td>
            </tr>
            <tr>
              <td>Defense</td>
              <td>{ selected.defense }</td>
            </tr>
            <tr>
              <td>HP</td>
              <td>{ selected.hp }</td>
            </tr>
            <tr>
              <td>SP Attack</td>
              <td>{ selected.sp_atk }</td>
            </tr>
            <tr>
              <td>SP Defense</td>
              <td>{ selected.sp_def }</td>
            </tr>
            <tr>
              <td>Speed</td>
              <td>{ selected.speed }</td>
            </tr>
            <tr>
              <td>Weight</td>
              <td>{ selected.weight }</td>
            </tr>
            <tr>
              <td>Total moves</td>
              <td>{ selected.moves }</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  }
};

export default PokemonInfo;