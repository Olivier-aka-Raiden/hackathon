/**
 * Individual Challenge Card Container
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

// Actions
import * as ChallengeActions from '@redux/challenges/actions';

// Components
import ChallengeCardRender from './CardView';

/* Redux ==================================================================== */
// What data from the store shall we send to the component?
const mapStateToProps = state => ({
  user: state.user,
  favourites: (state.challenge && state.challenge.favourites) ? state.challenge.favourites : null,
});

// Any actions to map to the component?
const mapDispatchToProps = {
  replaceFavourites: ChallengeActions.replaceFavourites,
};

/* Component ==================================================================== */
class ChallengeCard extends Component {
  static componentName = 'ChallengeCard';

  static propTypes = {
    challenge: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
      image: PropTypes.string,
    }).isRequired,
    replaceFavourites: PropTypes.func.isRequired,
    favourites: PropTypes.arrayOf(PropTypes.number),
    user: PropTypes.shape({
      uid: PropTypes.string,
    }),
  }

  static defaultProps = {
    favourites: null,
    user: null,
  }

  constructor(props) {
    super(props);
    this.state = { challenge: props.challenge };
  }

  componentWillReceiveProps(props) {
    if (props.challenge) {
      this.setState({ challenge: props.challenge });
    }
  }

  /**
    * On Press of Card
    */
  onPressCard = () => {
    Actions.challengeView({
      title: this.props.challenge.title,
      challenge: this.props.challenge,
    });
  }

  /**
    * When user taps to favourite a challenge
    */
  onPressFavourite = () => {
    if (this.props.user && this.props.user.uid) {
      const challengeId = this.props.challenge.id;

      if (challengeId && this.props.replaceFavourites) {
        const favs = this.props.favourites;

        // Toggle to/from current list
        if (this.isFavourite()) {
          favs.splice(favs.indexOf(this.props.challenge.id), 1);
        } else {
          favs.push(challengeId);
        }

        // Send new list to API
        this.props.replaceFavourites(favs);

        // Manually trigger a re-render - I wish I knew why this was required...
        this.setState({ challenge: this.state.challenge });
      }
    }
  }

  /**
    * Check in Redux to find if this Challenge ID is a Favourite
    */
  isFavourite = () => {
    const { favourites, challenge } = this.props;

    if (challenge && challenge.id && favourites) {
      if (favourites.length > 0 && favourites.indexOf(challenge.id) > -1) return true;
    }

    return false;
  }

  render = () => {
    const { challenge } = this.state;
    const { user } = this.props;

    return (
      <ChallengeCardRender
        title={challenge.title}
        body={challenge.body}
        image={challenge.image}
        onPress={this.onPressCard}
        onPressFavourite={(user && user.uid) ? this.onPressFavourite : null}
        isFavourite={(user && user.uid && this.isFavourite()) && true}
      />
    );
  }
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps, mapDispatchToProps)(ChallengeCard);
