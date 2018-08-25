import { Component } from 'react';
import { withRouter } from 'react-router-dom';

class ScrollToTop extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return this.props.children; //Return tat ca cac thanh phan duoc wraped ben trong ScrollToTop
  }
}

export default withRouter(ScrollToTop);
