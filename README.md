things that i need

server status
users
  types:
    mafia,
      mafioso,
      godfather,
      framer
    detective,
      cop,
      vigilante
    jester,
    healers,
      nurse
    villagers


  Game logic Non Technical
    day phase
      live face-to-face discussion
      announce events
      voting
      reveal
    night phase
      action: target,
      wait 30 secs,
      relay info to DM

  Game Logic Technical {
    game_over: {
      if mafia.alive != civs.alive
    }

    this.state = {
      alive_roles: {
        healer: boolean,
        vigilante: boolean,
        mafia: boolean,
        jester: boolean,
      },
      players: {
        id: alive || dead
      },
      phase: day || night,
      game_over: false,
      timer: 30 for voting, night || 1:30 for discussion
    }


    while(!game_over){
      this.setState({
        phase: this.state.phase === 'day' ? 'night' : 'day'
        })
    }

    countDown(time){
      setTimeOut((time) => {
        return time -= 0
        }, 1000)
    }


    nightPhase(){
      if countDown(this.state.timer) !== 0 {
        players.forEach((actions) => {
          firebase.set( actions )
        }
      }
      } else {
        firebase.playerActions.forEach((actions) => (
          //schema
          player | role | killed | saved | investigated
            1     'cop'     1       1       0
            2     'doctor'  0       0       1
          ))
    }

  }


      game schema {


        alive_roles: {
          healer: boolean,
          vigilante: boolean,
          mafia: boolean,
          jester: boolean,
        }

        players : {
          role: role,
          alive: boolean,
          diary: {
            day[n]: {
              entry
            }
          }
          kill_note(if applicable): {
            entry( one at a time)
          }
        }

        actions: {
          action: target
        }
      }
