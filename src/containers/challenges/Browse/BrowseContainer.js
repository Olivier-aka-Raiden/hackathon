/**
 * Challenge Tabs Container
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import { connect } from 'react-redux';

// The component we're mapping to
import ChallengeTabsRender from './BrowseView';

// What data from the store shall we send to the component?
const mapStateToProps = state => ({
  challengeTypes: state.challenge.challengeTypes || [],
});

// Any actions to map to the component?
const mapDispatchToProps = {
};
// TODO: Revoir si Render est juste ici ou pas?
export default connect(mapStateToProps, mapDispatchToProps)(ChallengeTabsRender);
