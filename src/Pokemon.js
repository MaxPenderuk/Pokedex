import React from 'react';
import request from 'superagent';

import PokemonInfo from './PokemonInfo';
import './types_colors.css';

class Pokemon extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      perPage: 12,
      pokemon: {},
      selected: undefined
    }
  }

  componentDidMount() {
    request
      .get('http://pokeapi.co/api/v1/pokedex/1/')
      .set('Accept', 'application/json')
      .end((err, res) => {
        var pokiObj = {};
        var pokedex = res.body.pokemon;
        for (var val of pokedex) {
          const id = val['resource_uri'].slice(6).match(/\d+/).toString();
          if (id <= 718) {
            pokiObj[id] = {
              id: id, name: val.name.charAt(0).toUpperCase() + val.name.slice(1),
              url: "http://pokeapi.co/" + val.resource_uri,
              img: 'http://pokeapi.co/media/img/' + id + '.png',
              types: []
            };
          }
        }
        this.setState({
          pokemon: pokiObj
        }, () => { this.fetchTypes(); });
      });
  }

  fetchTypes() {
    Object.keys(this.state.pokemon)
      .forEach((id, index) => {
        if (this.state.pokemon[id].types.length > 0 || index > this.state.page * this.state.perPage ) return;

        request
          .get(this.state.pokemon[id].url)
          .set('Accept', 'application/json')
          .end((err, res) => {
            const newPokemon = {};
            newPokemon[id] = this.state.pokemon[id];
            newPokemon[id].types = res.body.types;
            this.setState({
              pokemon: Object.assign(
                this.state.pokemon,
                newPokemon
              )
            });
          })
      })
  }

  incPage() {
    this.setState({
      page: this.state.page + 1,
    }, () => {
      this.fetchTypes();
    })
  }
  
  handleOnClick(item) {
    request
      .get(item.url)
      .set('Accept', 'application/json')
      .end((err, res) => {
        var obj = {
          name: item.name,
          img: item.img,
          types: res.body.types,
          attack: res.body.attack,
          defense: res.body.defense,
          hp: res.body.hp,
          sp_atk: res.body.sp_atk,
          sp_def: res.body.sp_def,
          speed: res.body.speed,
          weight: res.body.weight,
          moves: Object.keys(res.body.moves).length
        };

        this.setState({
          selected: obj
        });
      })
  }

  handleOnClose(isClosed) {
    if(isClosed) {
      this.setState({
        selected: undefined
      });
    }
  }

  render() {
    const {pokemon} = this.state;
    // const pokemon = this.state.pokemon
    return <div className="col-sm-12">
      <div className="title center-block"
           style={{ border: "1px solid #ddd", marginTop: "1%", borderRadius: "4px", width: "50%" }}>
        <h1 className="text-center">Pokedex</h1>
      </div>
      <div className="col-sm-8" style={{ marginTop: "1%", marginBottom: "1%" }}>
        { Object.keys(pokemon).slice(0, this.state.page * this.state.perPage)
          .map(id => pokemon[id])
          .map(item =>
            <div key={item.id} className="col-sm-4" onClick={ (e) => { e.preventDefault(); this.handleOnClick(item) } }>
              <div className="thumbnail">
                <div className="text-center" style={{ height: "120px" }}>
                  <a href="#">
                    <img src={ item.img }
                    />
                  </a>
                </div>
                <div className="caption">
                  <h4 className="text-center">
                    { item.name }
                  </h4>
                  <p className="types">
                    { item.types.map((type, index) => (
                      <a key={index} href="#" className={ "btn " + type.name } role="button">
                        { type.name.charAt(0).toUpperCase() + type.name.slice(1) }
                      </a>
                    )) }
                  </p>
                </div>
              </div>
            </div>
          )
        }

        {
          // If there are pokemons in selected state value -> show `Load more`
          Object.keys(this.state.pokemon).length > 0 ?
            <button className="btn btn-info center-block"
                    onClick={ this.incPage.bind(this) }>
              Load more
            </button>
            : null
        }

      </div>
      {
        this.state.selected !== undefined ? <PokemonInfo selected={ this.state.selected } onClose={ this.handleOnClose.bind(this) } /> : null
      }

    </div>;
  }
}

export default Pokemon;
