/**
 * Challenge Listing Screen
 *  - Shows a list of receipes
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  ListView,
  RefreshControl,
} from 'react-native';

// Consts and Libs
import { AppColors, AppStyles } from '@theme/';
import { ErrorMessages } from '@constants/';

// Containers
import ChallengeCard from '@containers/challenges/Card/CardContainer';

// Components
import Error from '@components/general/Error';

/* Component ==================================================================== */
class ChallengeListing extends Component {
  static componentName = 'ChallengeListing';

  static propTypes = {
    challengeList: PropTypes.arrayOf(PropTypes.object).isRequired,
    reFetch: PropTypes.func,
  }

  static defaultProps = {
    reFetch: null,
  }

  constructor() {
    super();

    this.state = {
      isRefreshing: true,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(props.challengeList),
      isRefreshing: false,
    });
  }

  /**
    * Refetch Data (Pull to Refresh)
    */
  reFetch = () => {
    if (this.props.reFetch) {
      this.setState({ isRefreshing: true });

      this.props.reFetch()
        .then(() => {
          this.setState({ isRefreshing: false });
        });
    }
  }

  render = () => {
    const { challengeList } = this.props;
    const { isRefreshing, dataSource } = this.state;

    if (!isRefreshing && (!challengeList || challengeList.length < 1)) {
      return <Error text={ErrorMessages.challenge404} />;
    }

    return (
      <View style={[AppStyles.container]}>
        <ListView
          initialListSize={5}
          renderRow={challenge => <ChallengeCard challenge={challenge} />}
          dataSource={dataSource}
          automaticallyAdjustContentInsets={false}
          refreshControl={
            this.props.reFetch ?
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={this.reFetch}
                tintColor={AppColors.brand.primary}
              />
            : null
          }
        />
      </View>
    );
  }
}

/* Export Component ==================================================================== */
export default ChallengeListing;
