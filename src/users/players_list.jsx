import React from 'react';
import { values } from 'lodash';

class PlayerList extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render(){
    const allPlayers = values(this.props.players).map((player) => (
      <div className='player-list-item flex' key={player.name}>
        <div className='player-name'>{player.name}</div>
        <div className='perform-ability-button'>{player.role}</div>
      </div>
    ));
    return(
      <div className='container player-list-item'>
        <h2>Players</h2>
        <div className='container'>
          {allPlayers}
        </div>
      </div>
    );
  }
}

export default PlayerList;
