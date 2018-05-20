import React from 'react';
import request from 'superagent';

import PokemonInfo from './PokemonInfo';
import './types_colors.css';

export default class Pokemon extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      offset: 0,
      limit: 18,
      pokemon: {},
      selected: undefined,
      isLoading: false
    }
  }

  componentDidMount() {
    this.fetchPokemons();
  }

  fetchPokemons = () => {
    request
      .get(`https://pokeapi.co/api/v2/pokemon/?limit=${this.state.limit}&offset=${this.state.offset}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        var pokiObj = {};
        var pokedex = res.body.results;

        for (var val of pokedex) {
          const { name } = val;
          const { url } = val;
          const id = url.slice(-3).match(/\d+/).toString();

          pokiObj[id] = {
            id,
            name: name.charAt(0).toUpperCase() + name.slice(1),
            url,
            img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + id + '.png',
            types: []
          };
        }

        this.setState({
          pokemon:  Object.assign(this.state.pokemon, pokiObj)
        }, () => {
          this.fetchTypes();
        });
      });
  }

  fetchTypes = () => {
    Object.keys(this.state.pokemon)
      .forEach((id, index) => {
        request
          .get(this.state.pokemon[id].url)
          .set('Accept', 'application/json')
          .end((err, res) => {
            const newPokemon = {};

            newPokemon[id] = this.state.pokemon[id];
            newPokemon[id].types = res.body.types.map(i => i.type);

            this.setState({
              pokemon: Object.assign(
                this.state.pokemon,
                newPokemon
              )
            });
          })
      })
  }

  handleLoadMoreOnClick = () => {
    this.setState({
      offset: this.state.offset + 18
    }, () => {
      this.fetchPokemons();
    })
  }
  
  handleOnClick = (item, event) => {
    event.preventDefault();

    this.setState({ isLoading: true }, () => {
      request
      .get(item.url)
      .set('Accept', 'application/json')
      .end((err, res) => {
        const { stats } = res.body;

        var obj = {
          name  : item.name,
          img   : item.img,
          types : res.body.types.map(i => i.type),
          stats : res.body.stats,
          moves : Object.keys(res.body.moves).length,
          weight: res.body.weight  
        };

        this.setState({
          selected: obj,
          isLoading: false
        });
      })
    });
  }

  handleOnClose = isClosed => {
    if (isClosed) {
      this.setState({
        selected: undefined
      });
    }
  }

  render() {
    const { pokemon } = this.state;

    return(
      <div> <div className='col-s-12'>
        <div id='title' className='title center-block'>
          <h1 className='text-center'>Kotedex</h1>
        </div>
        <div id='poki-list' className='col-s-8'>
          {
            Object.keys(pokemon)
            .map(id => pokemon[id])
            .map(item =>
              <div key={item.id} className='col-s-4' onClick={ this.handleOnClick.bind(null, item) }>
                <div className='thumbnail'>
                  <div className='text-center' style={{ height: '120px' }}>
                    <a href="#">
                      <img src={ item.img }
                      />
                    </a>
                  </div>
                  <div className='caption'>
                    <h4 className='text-center'>
                      { item.name }
                    </h4>
                    <div className="types">
                    {
                      item.types.length
                      ?
                        item.types.map((type, index) => (
                          <a key={index} href='#' className={ `btn ${type.name}` } role='button'>
                            { type.name.charAt(0).toUpperCase() + type.name.slice(1) }
                          </a>
                        ))
                      :
                        <div className='spinner-wrap'><div className='spinner'/></div>
                    }
                    </div>
                  </div>
                </div>
              </div>
            )
          }

          {
            // If there are pokemons in selected state value -> show `Load more`
            Object.keys(pokemon).length > 0 ?
              <button className='btn btn-info center-block'
                      onClick={ this.handleLoadMoreOnClick }>
                Load more
              </button>
              : null
          }

        </div>
        {
          this.state.selected !== undefined
          ? <PokemonInfo selected={ this.state.selected } onClose={ this.handleOnClose.bind(this) } />
          : null
        }
        </div>
        {
          this.state.isLoading
          ?
            <div className='page-overlay'>
              <div className='page-overlay-loader'/>
              <div className='page-overlay-loader-text'>Loading...</div>
            </div>
          : null
        }
      </div>
    );
  }
}
