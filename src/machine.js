import { Machine, assign } from 'xstate'

export const selectEvent = {
  type: 'SELECT',
  name: 'reactjs'
}

export const invokeFetchSubReddit = (context) => {
  const { subreddit } = context

  return fetch(`https://www.reddit.com/r/${subreddit}.json`)
    .then(response => response.json())
    .then(json => json.data.children.map(child => child.data));
}

export const redditMachine = Machine({
  id: 'reddit',
  initial: 'idle',
  context: {
    subreddit: null,
    posts: null
  },
  states: {
    idle: {},
    selected: {
      initial: 'loading',
      states: {
        loading: {
          invoke: {
            id: 'fetch-subreddit',
            src: invokeFetchSubReddit,
            onDone: { 
              target: 'loaded',
              actions: assign({
                posts: (_, event) => event.data
              })
            },
            onError: 'failed'
          }
        },
        loaded: {},
        failed: {}
      }
    }
  },
  on: {
    SELECT: {
      target: '.selected',
      actions: assign({
        subreddit: (_, event) => event.name
      })
    }
  }
})
