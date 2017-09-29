Firebase Tree

gamerooms: {
  gameId: {
    start: boolean,
    players: {
      player1, player2
    },
    phase: day,
    game_over: boolean
  }
}

roles: {
  doctor: {
    ability: healing,
    image: image_url,
    allegiance: town,
    win_condition: 'town wins',
    descriptions: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' ,
  }
}

abilities : {
  healer: {
    protect client
  },
  killer: {
    kill someone
  },
  framer: {
    frame someone,
  },
  investigate : {
    investigate someone
  }
}

days : {
  day: 15000,
  discussion: 45000,
  Voting: 30000,
  Defense: 20000,
  Judgement: 20000,
  LastWords: 5000,
  Night: 40000
}

dayCycle: [{phase: Day, time: 15000}
{phase: 'Discussion', time: 45000}
{phase: 'Voting', time: 30000}
{phase: 'Defense', time: 20000}
{phase: 'Judgement', time: 20000}
{phase: 'Last Words', time: 5000}
{phase: 'Night', time: 40000}]
