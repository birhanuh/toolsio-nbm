import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { deleteFlashMessage } from "../actions/flashMessageActions";

class FlashMessage extends PureComponent {
  // Detect location change for FlashMessage component
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.props.deleteFlashMessage(this.props.message.id);
    }
  }

  onClick = () => {
    this.props.deleteFlashMessage(this.props.message.id);
  };

  render() {
    const { type, text } = this.props.message;

    const message = (
      <div
        className={classnames("ui message", {
          positive: type === "success",
          negative: type === "error"
        })}
      >
        <i onClick={this.onClick} className="close icon" />
        <p>{text}</p>
      </div>
    );
    return (
      <div
        className={classnames({
          "sixteen wide column flash-message": !!type && !!text
        })}
      >
        {!!type && !!text && message}
      </div>
    );
  }
}

// Proptypes definition
FlashMessage.propTypes = {
  message: PropTypes.object.isRequired,
  deleteFlashMessage: PropTypes.func.isRequired
};

// Takes our global state and return just flashMessages
function mapStateToProps(state) {
  return {
    message: state.flashMessage
  };
}

export default connect(mapStateToProps, { deleteFlashMessage })(FlashMessage);
