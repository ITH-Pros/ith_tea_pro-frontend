import React from "react";
import PropTypes from "prop-types";
class UserIcon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: this.generateRandomColor(),
    };
  }

  generateRandomColor() {
    const colors = [
      "#E91E63",
      "#9C27B0",
      "#673AB7",
      "#3F51B5",
      "#2196F3",
      "#009688",
      "#4CAF50",
      "#FF9800",
      "#795548",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  render() {
    const { firstName } = this.props;
    const { backgroundColor } = this.state;
    const styles = {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      backgroundColor: backgroundColor,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "#fff",
      fontSize: "20px",
      textTransform: "uppercase",
      marginLeft:'-10px',
      marginRight:'-5px'
    };

    return (
      <div style={styles} className="user-pic">
        {firstName?.charAt(0) !== "." && firstName?.charAt(0)}
        {firstName?.charAt(0) === "." && firstName}
      </div>
    );
  }
}

UserIcon.propTypes = {
  firstName: PropTypes.string.isRequired,
};

export default UserIcon;
