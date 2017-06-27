/**
 * List of challenges for a type of challenge
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Actions
import * as ChallengeActions from '@redux/challenges/actions';

// Components
import Loading from '@components/general/Loading';
import ChallengeListingRender from './ListingView';

/* Redux ==================================================================== */
// What data from the store shall we send to the component?
const mapStateToProps = state => ({
  challengeList: state.challenge.challengeList || [],
});

// Any actions to map to the component?
const mapDispatchToProps = {
  getChallengeList: ChallengeActions.getChallengeList,
};

/* Component ==================================================================== */
class ChallengeListing extends Component {
  static componentName = 'ChallengeListing';

  static propTypes = {
    challengeList: PropTypes.arrayOf(PropTypes.object),
    challengeType: PropTypes.string.isRequired,
    getChallengeList: PropTypes.func.isRequired,
  }

  static defaultProps = {
    challengeList: [],
  }

  state = {
    loading: false,
    challengeList: [],
  }

  componentDidMount = () => this.getThisChallengeTypeChallengeList(this.props.challengeList);
  componentWillReceiveProps = props => this.getThisChallengeTypeChallengeList(props.challengeList);

  /**
    * Pick out challenge list that is in the current challenges
    * And hide loading state
    */
  getThisChallengeTypeChallengeList = (allChallenges) => {
    if (allChallenges.length > 0) {
      const challengeList = allChallenges.filter(challenge =>
        challenge.category.toString() === this.props.challengeType.toString(),
      );

      this.setState({
        challengeList,
        loading: false,
      });
    }
  }

  /**
    * Fetch Data from API
    */
  fetchChallengeList = () => this.props.getChallengeList()
    .then(() => this.setState({ error: null, loading: false }))
    .catch(err => this.setState({ error: err.message, loading: false }))

  render = () => {
    if (this.state.loading) return <Loading />;

    return (
      <ChallengeListingRender
        challengeList={this.state.challengeList}
        reFetch={this.fetchChallengeList}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeListing);
