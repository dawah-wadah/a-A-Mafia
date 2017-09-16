import React from "react";
import { Route } from "react-router-dom";
const renderMergedProps = (component, ...props) => {
	const finalProps = Object.assign({}, ...props);
	return React.createElement(component, finalProps);
};

const PropsRoute = ({ component, ...props }) => {
  debugger
	return (
		<Route
			{...props}
			render={routeProps => {
				return renderMergedProps(component, routeProps, props);
			}}
		/>
	);
};

export default PropsRoute;
