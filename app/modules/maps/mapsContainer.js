import { connect } from 'react-redux';
import MapsView from './mapsView';
import { bindActionCreators } from 'redux';
import { getContactsPosition } from './mapsState';

const mapStateToProps = state => ({
  data: state.maps.data,
  isLoading: state.maps.isLoading,
  error: state.maps.error,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getContactsPosition
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapsView);
