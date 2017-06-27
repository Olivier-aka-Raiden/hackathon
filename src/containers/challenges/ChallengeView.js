/**
 * Challenge View Screen
 *  - The individual challenge screen
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';

// Consts and Libs
import { AppStyles, AppSizes } from '@theme/';

// Components
import { Card, Spacer, Text } from '@ui/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
  featuredImage: {
    left: 0,
    right: 0,
    height: AppSizes.screen.height * 0.2,
    resizeMode: 'cover',
  },
});

/* Component ==================================================================== */
class ChallengeView extends Component {
  static componentName = 'ChallengeView';

  static propTypes = {
    challenge: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
      image: PropTypes.string,
      suggestions: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
  }

  /**
    * suggestions
    */
  renderSuggestions = (suggestions) => {
    const jsx = [];
    let iterator = 1;

    suggestions.forEach((item) => {
      jsx.push(
        <View key={`suggestion-${iterator}`} style={[AppStyles.row]}>
          <View><Text> - </Text></View>
          <View style={[AppStyles.paddingLeftSml, AppStyles.flex1]}>
            <Text>{item.toString()}</Text>
          </View>
        </View>,
      );
      iterator += 1;
    });

    return jsx;
  }

  render = () => {
    const { title, body, image, suggestions } = this.props.challenge;

    return (
      <ScrollView style={[AppStyles.container]}>
        {image !== '' &&
          <Image
            source={{ uri: image }}
            style={[styles.featuredImage]}
          />
        }

        <Card>
          <Text h2>{title.rendered}</Text>
          <Text>{body}</Text>
        </Card>

        {suggestions ?
          <Card>
            <Text h2>Suggestions</Text>
            {this.renderSuggestions(suggestions)}
          </Card>
        : null}

        <Spacer size={20} />
      </ScrollView>
    );
  }
}

/* Export Component ==================================================================== */
export default ChallengeView;
