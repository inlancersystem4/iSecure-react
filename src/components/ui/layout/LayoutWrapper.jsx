import PropTypes from "prop-types";

const LayoutWrapper = ({ children }) => {
  return <main className="main-layout">{children}</main>;
};

LayoutWrapper.propTypes = {
  children: PropTypes.node.isRequired
};

export default LayoutWrapper;
